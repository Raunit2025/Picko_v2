import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';
import jwt from 'jsonwebtoken';

function authenticate(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as jwt.JwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function GET(req: Request) {
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
