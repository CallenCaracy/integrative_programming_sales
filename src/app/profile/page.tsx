"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ProfileDetails from "@/components/home/ProfileDetails";
import ProfileUpdateForm from "@/components/home/ProfileUpdateForm";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/secure/users", { credentials: "include" });
        if (res.ok) {
          setProfile(await res.json());
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!profile) return <p className="text-center mt-10">No profile found. Please log in.</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-4xl shadow-lg rounded-2xl p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <ProfileDetails profile={profile} />
            </div>

            <div className="space-y-4">
              <ProfileUpdateForm
                profileId={profile._id}
                currentName={profile.name}
                currentCredit={profile.credit}
                onUpdated={(updated) => setProfile(updated)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}