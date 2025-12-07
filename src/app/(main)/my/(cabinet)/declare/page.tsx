import { ClaimForm } from "~/components/claim-form";
import { api } from "~/trpc/server";

export default async function DeclarePage() {
  // Get available properties for selection
  const buildings = await api.claims.availableProperties();

  // Get existing claims to show status
  const myClaims = await api.claims.my();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Недвижимость</h1>
        <p className="text-muted-foreground mt-1">
          Подайте заявку на подтверждение прав на объект
        </p>
      </div>

      <ClaimForm buildings={buildings} existingClaims={myClaims} />
    </div>
  );
}
