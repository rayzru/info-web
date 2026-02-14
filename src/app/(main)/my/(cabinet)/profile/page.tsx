import { PageHeader } from "~/components/page-header";
import { ProfileForm } from "~/components/profile-form";
import { api } from "~/trpc/server";

export default async function ProfilePage() {
  const { user, profile, effectiveTagline, taglineSetByAdmin } = await api.profile.get();

  return (
    <div>
      <PageHeader title="Профиль" description={`Настройки профиля и приватности`} />

      <ProfileForm
        user={user}
        profile={profile}
        effectiveTagline={effectiveTagline}
        taglineSetByAdmin={taglineSetByAdmin}
      />
    </div>
  );
}
