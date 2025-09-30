"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AddItemButton from "@/components/home/AddItemButton";
import AddItemModal from "@/components/home/AddItemModal";
import HomeLayout from "@/components/home/HomeLayout";

import SidebarFilters from "@/components/home/SideBarFillers";
import CategoryTabs from "@/components/home/CategoryTabs";
import ProductGrid from "@/components/home/ProductGrid";
import Loader from "@/components/loader/Loader";

export default function Home() {
  const { authenticated, loading } = useAuth();
  const router = useRouter();
  const [formShowed, setFormShowed] = useState(false);

  useEffect(() => {
    if (!authenticated) {
      toast.error("Unauthorized Access");
      router.push("/login");
    }
  }, [router, authenticated]);

  if (loading) {
    return <Loader />;
  }

  return (
    <HomeLayout>
      <div className="flex justify-end p-6">
        <AddItemButton onClick={() => setFormShowed(true)} />
      </div>

      {formShowed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <AddItemModal onClose={() => setFormShowed(false)} />
        </div>
      )}

      <div className="flex gap-6 p-6">
        <aside className="w-64 shrink-0">
          <SidebarFilters />
        </aside>

        <main className="flex-1">
          <CategoryTabs />
          <ProductGrid />
        </main>
      </div>
    </HomeLayout>
  );
}
