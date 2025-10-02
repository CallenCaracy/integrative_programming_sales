import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Item } from "@/models/Items";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } } // force sync
): Promise<NextResponse> {
  
  await connectToDatabase();

  try {
    const { id } = context.params;

    const item = await Item.findById(id);

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (err) {
    console.error("Error fetching item:", err);
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}
