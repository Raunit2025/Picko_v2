import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, items, totalAmount, deliveryMinutes, paymentMethod } = await req.json();

    if (!userId || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newOrder = await Order.create({
      userId,
      items: items.map((i: any) => ({
        foodName: i.foodName,
        quantity: i.quantity,
        price: i.price,
      })),
      totalAmount,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
      paymentMethod: paymentMethod || 'cash',
      estimatedDelivery: deliveryMinutes || 30,
      orderStatus: 'preparing'
    });

    return NextResponse.json({ success: true, orderId: newOrder._id }, { status: 201 });
  } catch (error: any) {
    console.error('Cash/UPI Order Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
