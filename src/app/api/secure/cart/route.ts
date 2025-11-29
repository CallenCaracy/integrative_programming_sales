import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Cart } from "@/models/Cart";
import { CartProduct } from "@/context/cartContext";

/**
 * NOTE FOR FUTURE SCALING:
 * When the Inventory Service is ready:
 *  ✅ Emit WebSocket event after successful checkout
 *  ✅ Payload: [{ productID, quantitySold }]
 *  ✅ Inventory service listens and updates stock
 */

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { cartRef, buyerId, products, totalPrice } = await req.json();

    const items = products.map((p: any) => ({
      itemId: p.productID,
      name: p.name,
      price: p.price,
      image: p.image,
      quantity: p.quantity,
      seller: p.seller ?? "Unknown Seller",
    }));

    const cart = await Cart.create({
      cartRef,
      buyerId,
      items,
      totalPrice: totalPrice ?? 0,
    });

    return NextResponse.json(cart, { status: 201 });

  } catch (error) {
    console.error("POST /api/secure/cart error:", error);
    return NextResponse.json(
      { message: "Failed to save cart", error },
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
      return NextResponse.json(
        { error: "buyerId is required" },
        { status: 400 }
      );
    }

    const cart = await Cart.find({ buyerId }).sort({ createdAt: -1 });

    return NextResponse.json(
      { data: cart },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET /api/secure/cart error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
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
      (sum: number, i: CartProduct) => sum + i.price * i.quantity,
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
