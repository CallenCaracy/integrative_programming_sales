"use client";

import { useAuth } from "@/context/authContext";

export default function ProfileDetails() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="space-y-2">
        <p><strong>Name: John Doe</strong></p>
        <p><strong>Email: JohnDoe@skeleton.com</strong></p>
        <p><strong>Credits: 100.00</strong></p>
      </div>
    );
  }

  if (!user) {
    return <p className="text-muted-foreground">No profile data available.</p>;
  }

  return (
    <div className="space-y-2">
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Credits:</strong> {user.credit}</p>
    </div>
  );
}
