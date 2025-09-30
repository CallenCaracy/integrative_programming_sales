"use client";

import { ReactNode } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-6 p-6">
      {children}
    </div>
  );
}
