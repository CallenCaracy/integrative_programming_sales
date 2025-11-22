import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { any } from "zod/v3";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();

  try {
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    return NextResponse.json(newUser, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      if ((err as any).code === 11000) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 409 }
        );
      }
    }
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
