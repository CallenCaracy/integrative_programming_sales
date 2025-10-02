type ProfileDetailsProps = {
  profile: {
    name: string;
    email: string;
    credit: number;
    createdAt: string;
  };
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
