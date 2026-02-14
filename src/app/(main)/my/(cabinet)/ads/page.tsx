import { ListingsView } from "~/components/listings-view";
import { PageHeader } from "~/components/page-header";
import { api } from "~/trpc/server";

export default async function AdsPage() {
  // Get user's listings
  const listings = await api.listings.my();

  // Get user's verified properties (for creating new listings)
  const myProperties = await api.listings.myProperties();

  const hasVerifiedProperties =
    myProperties.apartments.length > 0 || myProperties.parkingSpots.length > 0;

  return (
    <div>
      <PageHeader title="Мои объявления" description="Аренда и продажа недвижимости" />

      <ListingsView
        listings={listings}
        myProperties={myProperties}
        hasVerifiedProperties={hasVerifiedProperties}
      />
    </div>
  );
}
