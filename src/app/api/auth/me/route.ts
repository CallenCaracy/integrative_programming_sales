import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const token = req.cookies.get("token")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId).select("-password");
    console.log("User from db:", user)
    if (!user) {
      return NextResponse.json({ currentUser: null }, { status: 401 });
    }
    const currentUser = {
      _id: user._id,
      email: user.email,
      name: user.name,
      access: {
        token,
        refreshToken
      }
    }
    return NextResponse.json({ currentUser });
  } catch {
    return NextResponse.json({ currentUser: null }, { status: 401 });
  }
}
