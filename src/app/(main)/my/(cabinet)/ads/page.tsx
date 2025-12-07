import { ListingsView } from "~/components/listings-view";
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
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Мои объявления</h1>
        <p className="text-muted-foreground mt-1">
          Аренда и продажа недвижимости
        </p>
      </div>

      <ListingsView
        listings={listings}
        myProperties={myProperties}
        hasVerifiedProperties={hasVerifiedProperties}
      />
    </div>
  );
}
