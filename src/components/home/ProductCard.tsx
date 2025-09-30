"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import Image from "next/image";
import { DisplayItem } from "@/models/types/uiItem";

type ProductCardProps = {
  item: DisplayItem;
};

export default function ProductCard({ item }: ProductCardProps) {
  const { name, price, description, images, quantity } = item;
  const imageUrl = images[0]?.url ?? "/placeholder.png";

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
      <button className="absolute top-2 right-2 p-2 rounded-full bg-background shadow hover:bg-accent">
        <Heart className="w-4 h-4" />
      </button>

      {quantity === 0 && (
        <Badge className="absolute top-2 left-2" variant="destructive">
          Out of stock
        </Badge>
      )}
      <CardContent className="p-4 flex flex-col items-center text-center">
        <div className="relative w-64 h-64 mb-2">
          <Image
            src={imageUrl}
            alt={name}
            sizes="256px"
            fill
            className="object-contain rounded-lg"
          />
        </div>
         <h3 className="font-medium text-lg line-clamp-1">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <p className="mt-2 font-semibold">${price.toFixed(2)}</p>
        <p className="font-semibold">${quantity}</p>
      </CardContent>
    </Card>
  );
}
