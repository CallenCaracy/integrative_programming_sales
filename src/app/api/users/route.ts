import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/DbModels/User";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const users = await User.find({});
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();

  try {
    const newUser = new User(body);
    await newUser.save();
    return NextResponse.json(newUser, { status: 201 });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}