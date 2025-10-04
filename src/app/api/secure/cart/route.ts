import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Cart } from "@/models/Cart";
import { CartItem } from "@/context/cartContext";
import { Item } from "@/models/Items";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { cartRef, buyerId, items, totalPrice } = body;

    const dbItems = items.map((i: CartItem) => ({
      item: new mongoose.Types.ObjectId(i.itemId),       
      quantity: i.quantity,
      sellerId: i.sellerId ?? "test seller", 
    }));
    console.log("BUYER ID IN API CALL:", buyerId)
    const cart = await Cart.create({
      cartRef,
      buyerId,
      items: dbItems,
      totalPrice: totalPrice ?? 0,
    });

    for (const item of items) {
      await Item.findByIdAndUpdate(
        item.itemId,
        { $inc: { quantity: -item.quantity } }, 
        { new: true }
      );
    }

    return NextResponse.json(cart, { status: 201 });
  } catch (error) {
    console.error("POST /api/cart error:", error);
    return NextResponse.json(
      { error: error},
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const buyerId = searchParams.get("buyerId");

    if (!buyerId) {
      return NextResponse.json({ error: "buyerId is required" }, { status: 400 });
    }

    const cart = await Cart.findOne({ buyerId });

    return NextResponse.json(cart ?? { items: [], totalPrice: 0 });
  } catch (error) {
    console.error("GET /api/cart error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { buyerId, items } = body;
    if (!buyerId) {
      return NextResponse.json({ error: "buyerId is required" }, { status: 400 });
    }

    const totalPrice = items.reduce(
      (sum: number, i: CartItem) => sum + i.price * i.quantity,
      0
    );

    const cart = await Cart.findOneAndUpdate(
      { buyerId },
      { items, totalPrice },
      { new: true, upsert: true }
    );

    return NextResponse.json(cart);
  } catch (error) {
    console.error("PUT /api/cart error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { buyerId } = body;

    if (!buyerId) {
      return NextResponse.json({ error: "buyerId is required" }, { status: 400 });
    }

    const cart = await Cart.findOneAndUpdate(
      { buyerId },
      { items: [], totalPrice: 0 },
      { new: true }
    );

    return NextResponse.json(cart);
  } catch (error) {
    console.error("DELETE /api/cart error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
