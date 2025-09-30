import { NextRequest, NextResponse } from "next/server";
import { JwtPayload} from "@/models/types/jwt"
import connectToDatabase from "@/lib/mongodb";
import jwt  from "jsonwebtoken";
import { User } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

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

const accessToken = jwt.sign(
  { userId: (user._id as string).toString(), email: user.email } satisfies JwtPayload,
  JWT_SECRET,
  { expiresIn: "15m" }
);

const refreshToken = jwt.sign(
  { userId: (user._id as string).toString(), email: user.email } satisfies JwtPayload,
  REFRESH_SECRET,
  { expiresIn: "7d" }
);

  const response = NextResponse.json({ success: true });

  response.cookies.set("token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60, // 15 min
    path: "/",
  });

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });

  return response;
}
