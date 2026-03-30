import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';

export async function GET() {
  try {
    await dbConnect();

    const seeds = [
      { name: 'Test Student', email: 'student@university.edu', password: 'password123', role: 'customer' },
      { name: "Domino's Owner", email: 'owner@dominos.com', password: 'owner123', role: 'owner/admin' },
    ];

    const results: string[] = [];

    for (const seed of seeds) {
      const existing = await User.findOne({ email: seed.email });
      if (!existing) {
        await User.create(seed);
        results.push(`✅ Created: ${seed.email}`);
      } else {
        results.push(`⏭️ Already exists: ${seed.email}`);
      }
    }

    return NextResponse.json({ message: 'Seed complete', results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
