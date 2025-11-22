"use client";

import { Profile } from "@/models/types/profile";

export default function ProfileDetails({ profile }: { profile: Profile }) {
  if (!profile) {
    return <p className="text-muted-foreground">No profile data available.</p>;
  }

  return (
    <div className="space-y-2">
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Credits:</strong> {profile.credit}</p>
    </div>
  );
}
