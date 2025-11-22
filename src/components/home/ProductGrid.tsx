"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { DisplayItem } from "@/models/types/uiItem";

export default function ProductGrid() {
  const [items, setItems] = useState<DisplayItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    let es: EventSource | null = null;
    const controller = new AbortController();

    async function fetchAndSubscribe() {
      try {
        setLoading(true);
        const res = await fetch("/api/secure/items", {
          cache: "no-store",
          credentials: "include",
          signal: controller.signal,
        });

        if (!res.ok) {
          console.error("fetch /api/secure/items failed", res.status);
          if (!mounted) return;
          setItems([]);
          return;
        }

        const data = await res.json();
        if (!mounted) return;
        setItems(data);

        // create SSE (EventSource)
        try {
          es = new EventSource("/api/secure/items/stream", { withCredentials: true });
        } catch (err) {
          // Fallback for environments that don't support the second argument
          es = new EventSource("/api/secure/items/stream");
        }

        es.onmessage = async () => {
          try {
            const r = await fetch("/api/secure/items", { cache: "no-store", credentials: "include" });
            if (r.ok) {
              const d = await r.json();
              if (mounted) setItems(d);
            } else {
              console.warn("re-fetch failed:", r.status);
            }
          } catch (err: unknown) {
            // Ensure the error is an instance of Error before logging
            if (err instanceof Error) {
              console.error("error refetching items after SSE message:", err);
            }
          }
        };

        es.onerror = (ev) => {
          console.warn("SSE error, closing", ev);
          try { es?.close(); } catch {}
        };
      } catch (err: unknown) {
        // Handle the error in a type-safe way
        if (err instanceof Error) {
          console.error("Error fetching items:", err);
        } else {
          console.error("Unknown error occurred:", err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAndSubscribe();

    return () => {
      mounted = false;
      controller.abort();
      try { es?.close(); } catch {}
    };
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
