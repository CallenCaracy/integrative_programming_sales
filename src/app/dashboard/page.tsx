"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import HomeLayout from "@/components/home/HomeLayout";

import SidebarFilters from "@/components/home/SideBarFillers";
import CategoryTabs from "@/components/home/CategoryTabs";
import ProductGrid from "@/components/home/ProductGrid";
import Loader from "@/components/loader/Loader";

export default function Home() {
  const { authenticated, loading, user } = useAuth();
  const router = useRouter();
  const [formShowed, setFormShowed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !authenticated) {
      toast.error("Unauthorized Access");
      router.push("/login");
    }
  }, [router, authenticated, user, loading]);

  if (loading) {
    return <Loader />;
  }

  return (
    <HomeLayout>
      <div className="flex gap-6 p-6">
        <aside className="w-64 shrink-0 sticky top-6 h-fit">
          <SidebarFilters onPriceChange={setMaxPrice} />
        </aside>

        <main className="flex-1">
          <CategoryTabs onCategorySelect={setSelectedCategory} />
          <ProductGrid
            selectedCategory={selectedCategory}
            maxPrice={maxPrice}
          />
        </main>
      </div>
    </HomeLayout>
  );
}
