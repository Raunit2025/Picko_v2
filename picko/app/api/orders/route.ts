import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import FoodCourt, { IFoodCourt } from "@/lib/models/FoodCourt";
import { jwtVerify } from "jose";

// Helper to extract and verify the user from the secure cookie
async function getUserFromCookie(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; role: string };
  } catch {
    // Removed unused 'error' variable to satisfy ESLint
    return null;
  }
}

// POST: Create a new order
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // 1. Authenticate user securely from edge cookie
    const user = await getUserFromCookie(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, paymentMethod } = body; 

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 2. BACKEND PRICE CALCULATION
    // Cast the lean result to our strict IFoodCourt type
    const foodCourts = (await FoodCourt.find({}).lean()) as unknown as IFoodCourt[];
    const priceMap = new Map<string, number>();
    
    // Flatten the nested structure to create a quick lookup dictionary (Strictly Typed)
    foodCourts.forEach((court) => {
      court.shops.forEach((shop) => {
        shop.items.forEach((item) => {
          if (item._id) {
            priceMap.set(item._id.toString(), item.price);
          }
        });
      });
    });

    let realTotalAmount = 0;
    const validOrderItems = [];

    // 3. Validate each item and calculate the true total
    for (const item of items) {
      const realPrice = priceMap.get(item.id);
      
      if (realPrice === undefined) {
        return NextResponse.json(
          { error: `Menu item not found or unavailable: ${item.foodName}` }, 
          { status: 400 }
        );
      }
      
      realTotalAmount += realPrice * item.quantity;
      
      validOrderItems.push({
        foodName: item.foodName,
        quantity: item.quantity,
        price: realPrice,
      });
    }

    // 4. Create the order
    const newOrder = await Order.create({
      userId: user.userId,
      items: validOrderItems,
      totalAmount: realTotalAmount,
      paymentMethod: paymentMethod || "cash",
      paymentStatus: paymentMethod === "online" ? "paid" : "pending",
      orderStatus: "preparing",
    });

    return NextResponse.json(newOrder, { status: 201 });

  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET: Fetch orders based on user role
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const user = await getUserFromCookie(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let orders;

    if (user.role === "owner/admin") {
      orders = await Order.find({})
        .sort({ createdAt: -1 })
        .populate("userId", "name email")
        .lean();
    } else {
      orders = await Order.find({ userId: user.userId })
        .sort({ createdAt: -1 })
        .lean();
    }

    return NextResponse.json(orders, { status: 200 });

  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}