import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs"; 

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    // 1. Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Please fill in all fields" }, { status: 400 });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    // 3. Hash the password before saving! <-- FIXED
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword, // Save the hashed password, NOT plain text
      role: "customer",
    });

    // 5. Generate JWT Token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ 
      userId: newUser._id.toString(), 
      role: newUser.role 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    // 6. Send Response and Set HTTP-Only Cookie
    const response = NextResponse.json(
      { 
        user: { 
          id: newUser._id.toString(), 
          name: newUser.name, 
          email: newUser.email, 
          role: newUser.role 
        } 
      },
      { status: 201 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}