import { MapPin, Building } from "lucide-react";
import { Button } from "~/components/ui/button";
import { YandexMapsLogo } from "~/components/icons/yandex-maps";
import { GoogleMapsLogo } from "~/components/icons/google-maps";
import { DoubleGisLogo } from "~/components/icons/2gis";
import type { Contact, Building as BuildingType } from "./types";
import { SectionCard } from "./section-card";

type LocationSectionProps = {
  addresses: Contact[];
  building?: BuildingType | null;
  floorNumber?: number | null;
};

function MapLinks({ address }: { address: string }) {
  const encodedAddress = encodeURIComponent(address);

  return (
    <div className="flex shrink-0 gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        asChild
        className="[&>svg]:h-5 [&>svg]:w-5"
      >
        <a
          href={`https://yandex.ru/maps/?text=${encodedAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Яндекс Карты"
        >
          <YandexMapsLogo />
        </a>
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        asChild
        className="[&>svg]:h-5 [&>svg]:w-5"
      >
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Google Maps"
        >
          <GoogleMapsLogo />
        </a>
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        asChild
        className="[&>svg]:h-5 [&>svg]:w-5"
      >
        <a
          href={`https://2gis.ru/search/${encodedAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          title="2ГИС"
        >
          <DoubleGisLogo />
        </a>
      </Button>
    </div>
  );
}

export function LocationSection({
  addresses,
  building,
  floorNumber,
}: LocationSectionProps) {
  const hasBuildingInfo = building?.number != null || floorNumber != null;
  const hasAddresses = addresses.length > 0;

  if (!hasBuildingInfo && !hasAddresses) return null;

  return (
    <SectionCard icon={MapPin} title="Местоположение">
      <div className="space-y-3">
        {hasBuildingInfo && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
              <Building className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-sm">
              {building?.number != null && <span>Строение {building.number}</span>}
              {floorNumber != null && (
                <span>
                  {building?.number != null && ", "}
                  {floorNumber > 0
                    ? `${floorNumber} этаж`
                    : `${floorNumber} этаж (подвал)`}
                </span>
              )}
            </div>
          </div>
        )}

        {addresses.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm">{contact.value}</p>
                {contact.label && (
                  <p className="text-xs text-muted-foreground">
                    {contact.label}
                  </p>
                )}
              </div>
            </div>
            <MapLinks address={contact.value} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
