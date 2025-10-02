"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ItemDetails from "@/components/home/ItemDetails";

type DisplayItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: { url: string }[];
};

export default function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [item, setItem] = useState<DisplayItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await fetch(`/api/secure/items/${id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          setError(true);
          return;
        }

        const data: DisplayItem = await res.json();
        setItem(data);
      } catch (e) {
        console.error("Failed to fetch item", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10">Loading item...</p>;
  }

  if (error || !item) {
    notFound();
  }

  const imageUrl = item.images[0]?.url ?? "/placeholder.png";

  return <ItemDetails item={item} />;
}
