import { NextRequest, NextResponse } from "next/server";
import { JwtPayload} from "@/models/types/jwt"
import jwt, { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (!refreshToken) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as JwtPayload & DefaultJwtPayload;

    const newAccessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const res = NextResponse.json({ success: true });

    res.cookies.set("token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60,
      path: "/",
    });
    console.log("Refresh OK")
    return res;
  } catch (err) {
    console.error("Refresh failed", err);
    return NextResponse.json({ message: "Invalid refresh token" }, { status: 403 });
  }
}
