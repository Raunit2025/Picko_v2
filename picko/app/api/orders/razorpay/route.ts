import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { jwtVerify } from "jose";

// Securely check if user is logged in
async function getUserFromCookie(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromCookie(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Create the order (Razorpay expects amount in smaller denomination, e.g., paise)
    const options = {
      amount: amount * 100, 
      currency: "INR",
      // FIXED: Shortened the receipt string to stay well under the 40-character limit
      receipt: `rcpt_${Date.now().toString(36)}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment gateway" },
      { status: 500 }
    );
  }
}