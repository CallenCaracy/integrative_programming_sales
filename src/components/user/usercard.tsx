import React from "react";

type Props = {
    name: string;
    email: string;
    credits: number;
};

export default function UseCard({ name, email, credits }: Props){
    return (
    <div className="p-4 rounded-2xl shadow-md bg-white/90 dark:bg-gray-800/80 max-w-md">
      <h3 className="text-xl font-semibold">{name}</h3>
      {email && <p className="text-sm text-gray-500">{email}</p>}
      <p className="mt-3 text-sm">Credit: ₱{credits.toFixed(2)}</p>
    </div>
  );
}