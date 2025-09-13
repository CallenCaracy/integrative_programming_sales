import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const users = await User.find({});
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const body = await req.json();
  const newUser = new User(body);
  await newUser.save();

  return NextResponse.json(newUser);
}
