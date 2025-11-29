"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/models/types/products";

type ProductGridProps = {
  selectedCategory: string;
  maxPrice: number | null;
};

export default function ProductGrid({ selectedCategory, maxPrice }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          "page-size": "20",
          ...(maxPrice !== null && { "price-range": `0-${maxPrice}` }),
          ...(selectedCategory !== "all" && { category: selectedCategory }),
        });

        const res = await fetch(`/api/secure/products?${params.toString()}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch products");

        const json = await res.json();
        setProducts(json.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, maxPrice]);

  if (loading) return <p className="text-gray-500">Loading products...</p>;
  if (products.length === 0) return <p className="text-gray-500">No products found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
