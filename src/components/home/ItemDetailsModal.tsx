"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type DisplayItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: { url: string }[];
};

export default function ItemDetailsModal({
  item,
  onClose,
}: {
  item: DisplayItem;
  onClose: () => void;
}) {
  const imageUrl = item.images[0]?.url ?? "/placeholder.png";
  const [count, setCount] = useState(1);
  const totalPrice = count * item.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-4xl w-full mx-4 p-6 rounded-2xl shadow-lg bg-white dark:bg-zinc-900">
        {/* Close Button */}
        <button
          title="Close"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-8">
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

            {item.quantity > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Quantity: {count}
                </label>
                <input
                  title="quantity"
                  type="range"
                  min={1}
                  max={item.quantity}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            )}

            <p className="text-lg font-semibold">
              Total: ${totalPrice.toFixed(2)}
            </p>

            <button
              disabled={item.quantity === 0}
              className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
