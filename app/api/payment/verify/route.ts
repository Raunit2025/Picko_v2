import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      userId,
      items,
      totalAmount,
      deliveryMinutes,
      paymentMethod
    } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET || '';

    // Verify signature
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      return NextResponse.json({ error: 'Transaction not legit!' }, { status: 400 });
    }

    await dbConnect();

    const formattedItems = items.map((item: any) => ({
      foodName: item.foodName,
      quantity: item.quantity,
      price: item.price
    }));

    // Save order
    const order = await Order.create({
      userId,
      items: formattedItems,
      totalAmount,
      paymentStatus: 'paid',
      paymentMethod: paymentMethod || 'razorpay',
      estimatedDelivery: deliveryMinutes || 30,
      orderStatus: 'preparing',
      razorpayDetails: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature
      }
    });

    return NextResponse.json({
      message: 'Payment verified',
      order
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error verifying Razorpay order' }, { status: 500 });
  }
}
