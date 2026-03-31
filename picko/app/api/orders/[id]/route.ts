import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import { jwtVerify } from "jose";

async function getUserFromCookie(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function PATCH(
  req: NextRequest,
  // 1. Properly type params as a Promise for Next.js 15+ routing
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    // Only owners/admins can update orders
    const user = await getUserFromCookie(req);
    if (!user || user.role !== "owner/admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Await the params before accessing the ID
    const { id } = await context.params;

    const body = await req.json();
    const { orderStatus, paymentStatus } = body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { 
        $set: { 
          ...(orderStatus && { orderStatus }), 
          ...(paymentStatus && { paymentStatus }) 
        } 
      },
      // 3. Replaced deprecated { new: true } with the modern Mongoose equivalent
      { returnDocument: 'after' }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Update Order Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}