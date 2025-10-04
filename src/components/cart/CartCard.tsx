"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
type CartItemProps = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: { url: string }[];
  onRemove: () => void;
};

export default function CartItemCard({ id, name, price, quantity, image, onRemove }: CartItemProps) {
  const imageUrl = image?.[0]?.url ?? "/placeholder.png";
  const total = price * quantity;
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowImage(true), 1900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center gap-6 p-4 border rounded-lg shadow-sm bg-white dark:bg-zinc-900">
      <div className="relative w-24 h-24 shrink-0 overflow-hidden">
        {showImage && (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="96px"
            className="object-contain rounded-md"
          />
        )}
      </div>

      <div className="flex flex-col flex-1">
        <h2 className="font-semibold text-lg">{name}</h2>
        <p className="text-sm text-muted-foreground">
          ${price.toFixed(2)} × {quantity}
        </p>
        <p className="font-bold mt-1">Total: ${total.toFixed(2)}</p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        title="Remove item"
        onClick={onRemove}
        className="text-red-500 hover:text-red-700"
      >
        <X className="w-5 h-5" />
      </Button>
    </div>
  );
}