"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [newName, setNewName] = useState("");
  const [creditToAdd, setCreditToAdd] = useState(0);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/secure/users", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setNewName(data.name); // preload current name
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  async function handleUpdate() {
    if (!profile) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/secure/users/${profile._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          credit: profile.credit + Number(creditToAdd || 0),
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setCreditToAdd(0);
      }
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="text-center mt-10">No profile found. Please log in.</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md space-y-4 p-4">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Credits:</strong> {profile.credit}</p>
          <p><strong>Created:</strong> {new Date(profile.createdAt).toLocaleString()}</p>

          <hr className="my-4" />

          <h3 className="text-lg font-semibold">Update Profile</h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium">New Name</label>
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Add Credits</label>
            <Input
              type="number"
              value={creditToAdd}
              onChange={(e) => setCreditToAdd(Number(e.target.value))}
            />
          </div>

          <Button
            onClick={handleUpdate}
            disabled={updating}
            className="w-full"
          >
            {updating ? "Updating..." : "Update"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
