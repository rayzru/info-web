import { eq } from "drizzle-orm";
import { type Database } from "../index";
import * as schema from "../schema";

export const usersProperty = ({ db }: { db: Database }) => ({
  linkApartment: async (
    userId: string,
    buildingId: string,
    apartmentNumber: number,
    role: "ApartmentOwner" | "ApartmentResident" = "ApartmentResident"
  ) => {
    const apartment = await db.query.apartments.findFirst({
      where: eq(schema.apartments.number, apartmentNumber.toString()),
      with: {
        floor: {
          with: {
            entrance: {
              with: {
                building: true,
              },
            },
          },
        },
      },
    });

    if (!apartment?.id || apartment.floor.entrance.building.id !== buildingId) {
      throw new Error("Apartment not found");
    }

    await db.insert(schema.userApartments).values({
      userId,
      apartmentId: apartment.id,
      status: "pending",
      role,
    });
  },
});
