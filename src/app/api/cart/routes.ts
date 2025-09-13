import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import {Cart} from "@/models/DbModels/Cart";

interface Items {
    item: string;
    quantity: number;
}

export async function POST(req: NextRequest) {
    await connectToDatabase();

    const formData = await req.formData();
    const userId = formData.get("userId") as string;
    const cartRef = formData.get("cartRef") as string;
    const totalPrice = Number(formData.get("totalPrice"));
    const itemsRaw = formData.get("items") as string;

    let items: Items[] = [];
    try {
        items = JSON.parse(itemsRaw);
    } catch (err) {
        return NextResponse.json({ error: "Invalid items format" }, { status: 400 });
    }

    const cart = await Cart.create({
        cartRef,
        userId,
        totalPrice,
        items,
    })
    await cart.save();
    return NextResponse.json(cart, {status: 201});
}