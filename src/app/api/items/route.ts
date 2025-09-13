import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { Item } from "@/models/DbModels/Items";

const folderName = "IntegrativeProgramming";

export async function POST(req: NextRequest) {
    await connectToDatabase();

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const quantity = Number(formData.get("quantity"));
    const file = formData.get("image") as File;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!file) {
        throw new Error("No file uploaded");
    }

    const uploadRes = await new Promise<{ url: string; public_id: string }>(
        (resolve, reject) => {
            cloudinary.uploader
                .upload_stream({ folder: folderName }, (error, result) => {
                    if (error || !result) return reject(error);
                    resolve({ url: result.secure_url, public_id: result.public_id });
                })
                .end(buffer);
        }
    );

const newItem = new Item({
    name,
    description,
    price,
    quantity,
    images: [uploadRes],
});
await newItem.save();

return NextResponse.json(newItem, {status: 201});
}

export async function GET() {
    await connectToDatabase();

    try {
        const items = await Item.find({});
        return NextResponse.json(items);
    } catch (err) {
        console.error("Error fetching items:", err);
        return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
    }
}
