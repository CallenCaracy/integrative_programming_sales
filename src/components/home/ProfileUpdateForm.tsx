"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ProfileUpdateFormProps = {
  profileId: string;
  currentName: string;
  currentCredit: number;
  onUpdated: (updated: any) => void;
};

export default function ProfileUpdateForm({ profileId, currentName, currentCredit, onUpdated }: ProfileUpdateFormProps) {
  const [newName, setNewName] = useState(currentName);
  const [creditToAdd, setCreditToAdd] = useState(0);
  const [updating, setUpdating] = useState(false);

  async function handleUpdate() {
    setUpdating(true);
    try {
      const res = await fetch(`/api/secure/users/${profileId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          credit: currentCredit + Number(creditToAdd || 0),
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        onUpdated(updated);
        setCreditToAdd(0);
      }
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Update Profile</h3>

      <div className="space-y-2">
        <label className="block text-sm font-medium">New Name</label>
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Add Credits</label>
        <Input
          type="number"
          value={creditToAdd}
          onChange={(e) => setCreditToAdd(Number(e.target.value))}
        />
      </div>

      <Button onClick={handleUpdate} disabled={updating} className="w-full">
        {updating ? "Updating..." : "Update"}
      </Button>
    </div>
  );
}
