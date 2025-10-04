"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";

export default function ProfileUpdateForm({
  profileId,
  currentName,
  currentCredit,
}: {
  profileId: string;
  currentName: string;
  currentCredit: number;
}) {
  const [newName, setNewName] = useState(currentName);
  const [creditToAdd, setCreditToAdd] = useState(0);
  const [updating, setUpdating] = useState(false);

  const { updateUser } = useAuth();

  async function handleUpdate() {
    setUpdating(true);
    try {
      await updateUser({
        name: newName,
        credit: currentCredit + Number(creditToAdd || 0),
      });

      setCreditToAdd(0);
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
