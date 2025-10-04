import { Profile } from "@/models/types/profile";

type ProfileDetailsProps = {
  profile: Profile;
};

export default function ProfileDetails({ profile }: ProfileDetailsProps) {
  return (
    <div className="space-y-2">
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Credits:</strong> {profile.credit}</p>
      <p><strong>Created:</strong> {new Date(profile.createdAt).toLocaleString()}</p>
    </div>
  );
}
