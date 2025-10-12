"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@/models/types/category";

type Props = {
  onCategorySelect: (category: string) => void;
};

export default function CategoryTabs({ onCategorySelect }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("all");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/secure/categories", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch categories");

        const json = await res.json();
        setCategories(json.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

  fetchCategories();
}, []);

  if (loading) {
    return <p className="text-gray-500">Loading categories...</p>;
  }

  if (categories.length === 0) {
    return <p className="text-gray-500">No categories found.</p>;
  }

  return (
    <Tabs
      value={selected}
      onValueChange={(val) => {
        setSelected(val);
        onCategorySelect(val);
      }}
      className="mb-6"
    >
      <TabsList className="flex flex-wrap gap-8">
        <TabsTrigger value="all">All</TabsTrigger>
        {categories.map((cat) => (
          <TabsTrigger key={cat.id} value={cat.name}>
            {cat.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}