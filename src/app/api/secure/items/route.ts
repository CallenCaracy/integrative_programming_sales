import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { Item } from "@/models/Items";

const folderName = "IntegrativeProgramming";
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const quantity = Number(formData.get("quantity"));
    const file = formData.get("image") as File;
    const sellerId = formData.get("sellerId") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log("Incoming form data:", {
      name,
      description,
      price,
      quantity,
      file,
    });
    const uploadRes = await new Promise<{ url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: folderName }, (error, result) => {
            if (error || !result) return reject(error);
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
            });
          })
          .end(buffer);
      }
    );

    const newItem = new Item({
      name,
      description,
      price,
      quantity,
      sellerId,
      images: [uploadRes],
    });

    await newItem.save();

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectToDatabase();

  try {
    const items = await Item.find({});
    return NextResponse.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}
