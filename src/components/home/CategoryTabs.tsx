"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CategoryTabs() {
  return (
    <Tabs defaultValue="all" className="mb-6">
      <TabsList className="flex flex-wrap gap-8">
        {["All", "Deals", "Crypto", "Fashion", "Health", "Sport", "Music", "Gaming"].map((cat) => (
          <TabsTrigger key={cat} value={cat.toLowerCase()}>
            {cat}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
