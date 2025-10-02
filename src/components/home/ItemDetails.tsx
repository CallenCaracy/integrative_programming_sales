"use client";

import Image from "next/image";
import Link from "next/link";

type DisplayItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: { url: string }[];
};

export default function ItemDetails({ item }: { item: DisplayItem }) {
  const imageUrl = item.images[0]?.url ?? "/placeholder.png";

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={item.name}
            fill
            className="object-contain"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold">{item.name}</h1>
          <p className="text-muted-foreground">{item.description}</p>
          <p className="text-xl font-semibold">${item.price.toFixed(2)}</p>
          <p
            className={item.quantity > 0 ? "text-green-600" : "text-red-600"}
          >
            {item.quantity > 0
              ? `In Stock (${item.quantity})`
              : "Out of Stock"}
          </p>

          <button
            disabled={item.quantity === 0}
            className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
          >
            Add to Cart
          </button>

          <Link
            href="/dashboard"
            className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
