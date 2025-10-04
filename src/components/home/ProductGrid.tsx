"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { DisplayItem } from "@/models/types/uiItem";

export default function ProductGrid() {
  const [items, setItems] = useState<DisplayItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true);
        const res = await fetch("/api/secure/items", { cache: "no-store" });
        setItems(await res.json());
        
        const eventSource = new EventSource("/api/secure/items/stream");
        eventSource.onmessage = async () => {
          const res = await fetch("/api/secure/items", { cache: "no-store" });
          setItems(await res.json());
        };

        return () => eventSource.close();
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  if (loading) return <p className="text-center py-10">Loading items...</p>;
  if (items.length === 0) return <p className="text-center py-10">No items available</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <ProductCard key={item._id} item={item} />
      ))}
    </div>
  );
}
