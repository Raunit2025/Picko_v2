import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';
import jwt from 'jsonwebtoken';

function authenticate(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    throw new Error('Unauthorized');
  }
  
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as jwt.JwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function GET(req: NextRequest) {
  try {
    let user;
    try {
      user = authenticate(req);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 401 });
    }

    await dbConnect();

    let orders;
    if (user.role === 'owner/admin') {
      orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'name email phone');
    } else {
      orders = await Order.find({ userId: user.id }).sort({ createdAt: -1 });
    }

    return NextResponse.json({ orders }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let user;
    try {
      user = authenticate(req);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { items, totalAmount, deliveryMinutes, paymentMethod, paymentStatus } = body;

    const newOrder = await Order.create({
      userId: user.id,
      items,
      totalAmount,
      estimatedDelivery: deliveryMinutes || 30,
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: paymentStatus || 'pending',
      orderStatus: 'preparing'
    });

    return NextResponse.json({ message: 'Order created', order: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
