"use client";

import { useAuth } from "@/context/authContext";

export default function ProfileDetails() {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center">Loading profile...</p>;

  if (!user) return <p className="text-muted-foreground">No profile data available.</p>;

  return (
    <div className="space-y-2">
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Credits:</strong> {user.credit}</p>
    </div>
  );
}
