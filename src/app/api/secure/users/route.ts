import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { User } from "@/models/User";

export async function GET(req: NextRequest) {
    await connectToDatabase();

    const token = req.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (err) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await connectToDatabase();

    const { id } = await params;

    const body = await req.json();
    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });

    if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await connectToDatabase();

    const { id } = await params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User successfully deleted.", user: deletedUser });
}