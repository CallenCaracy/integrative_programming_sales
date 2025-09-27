import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { User } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  const response = NextResponse.json({ success: true });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    path: "/",
  });

  return response;
}
