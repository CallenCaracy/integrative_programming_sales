"use client";

import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

export default function ProfileUpdateForm() {
  const { user, setUser } = useAuth();
  const [credits, setCredits] = useState(user?.credit || 0);

  if (!user) return null;

  // Updating the local credits
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev =>
      prev ? { ...prev, credit: (prev.credit || 0) + credits } : prev
    );
    toast.success("Local credits updated!");
  };

  return (
    <div>
      <div className="text-sm text-gray-600">
        Current Credits: 
        <span className="font-semibold text-blue-600 ml-1">
          {user.credit ?? 0}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1">User ID</label>
          <input
            title="ID"
            type="text"
            value={user.id}
            disabled
            className="w-full px-3 py-2 rounded-md bg-gray-100 text-gray-700 border"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Username</label>
          <input
            title="Username"
            type="text"
            value={user.username}
            disabled
            className="w-full px-3 py-2 rounded-md bg-gray-100 text-gray-700 border"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Add Credits</label>
          <input
            type="number"
            min={0}
            value={credits}
            onChange={(e) => setCredits(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-md border"
            placeholder="Enter credits to add"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Apply Update
        </button>
      </form>
    </div>
  );
}