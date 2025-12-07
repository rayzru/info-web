import { ProfileForm } from "~/components/profile-form";
import { api } from "~/trpc/server";

export default async function ProfilePage() {
  const { user, profile } = await api.profile.get();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Профиль</h1>
        <p className="text-muted-foreground mt-1">
          Настройки профиля и приватности
        </p>
      </div>

      <ProfileForm user={user} profile={profile} />
    </div>
  );
}
