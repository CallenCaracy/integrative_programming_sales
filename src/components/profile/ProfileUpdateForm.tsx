"use client";

import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

export default function ProfileUpdateForm() {
  const { user, setUser } = useAuth();
  const [credits, setCredits] = useState(user?.credit || 0);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/secure/update-credits", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credit: credits }),
      });

      if (res.ok) {
        setUser({ ...user, credit: credits });
        toast.success("Credits updated!");
      } else {
        toast.error("Failed to update credits");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unknown error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>ID:</label>
        <input title="User ID" type="text" value={user.id} disabled className="bg-gray-100" />
      </div>
      <div>
        <label>Username:</label>
        <input title="Username" type="text" value={user.username} disabled className="bg-gray-100" />
      </div>
      <div>
        <label>Credits:</label>
        <input
          type="number"
          title="Credits"
          value={credits}
          onChange={(e) => setCredits(Number(e.target.value))}
          className="border p-1"
        />
      </div>
      <button type="submit" className="btn-primary">Update Credits</button>
    </form>
  );
}
