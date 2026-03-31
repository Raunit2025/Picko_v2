import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

// Ensure the secret exists and encode it for jose
const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error("JWT_SECRET environment variable is missing.");
}
const encodedSecret = new TextEncoder().encode(secretKey);

export async function POST(req: Request) {
  try {
    await connectDB();
    
    // Strictly type the expected request body
    const body: Record<string, string> = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ email });

    // 1. Auto-Create Test Users if they don't exist yet
    if (!user && (email === "student@university.edu" || email === "owner@dominos.com")) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const role = email === "owner@dominos.com" ? "owner/admin" : "customer";
      const name = email === "owner@dominos.com" ? "Test Owner" : "Test Student";

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
      });
    }

    // 2. Validate user existence
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 3. Validate password
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 4. Generate Edge-compatible JWT using 'jose'
    const token = await new SignJWT({ 
      userId: user._id.toString(), 
      role: user.role 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(encodedSecret);

    // 5. Prepare the response (DO NOT send the token in the JSON body)
    const response = NextResponse.json({
      message: "Login successful",
      user: { 
        id: user._id.toString(), 
        name: user.name, 
        email: user.email, 
        role: user.role 
      },
    }, { status: 200 });

    // 6. Set the HTTP-Only cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure (HTTPS) in production
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      sameSite: "lax",
    });

    return response;
    
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}