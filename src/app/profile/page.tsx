"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ProfileDetails from "@/components/profile/ProfileDetails";

export default function ProfilePage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-4xl shadow-lg rounded-2xl p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <ProfileDetails />
            </div>

            <div className="space-y-4">
              {/* You can keep the update form, but pass current user from AuthContext */}
              {/* e.g., <ProfileUpdateForm profile={user} /> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
