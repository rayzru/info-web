import { type Database } from "../index";
import * as schema from "../schema";

export const buildings = ({ db }: { db: Database }) => ({
  count: async () => {
    return await db.$count(schema.buildings);
  },
  create: async (building: typeof schema.buildings.$inferInsert) => {
    const [b] = await db.insert(schema.buildings).values(building).returning();
    return b;
  },
  summary: async () => {
    const buildingsWithData = await db.query.buildings.findMany({
      columns: {
        id: true,
        number: true,
        title: true,
        liter: true,
        active: true,
      },
      with: {
        entrances: {
          with: {
            floors: {
              with: {
                apartments: {
                  columns: {
                    number: true,
                  },
                },
              },
            },
          },
        },
        parkings: {
          with: {
            floors: {
              with: {
                spots: {
                  columns: {
                    number: true,
                  },
                },
              },
            },
          },
        },
      },
      where: (table, { eq }) => eq(table.active, true),
    });

    return buildingsWithData.map((building) => ({
      ...building,
      maxApartmentNumber: Math.max(
        ...building.entrances.flatMap((entrance) =>
          entrance.floors.flatMap((floor) =>
            floor.apartments.map((apartment) => Number(apartment.number)),
          ),
        ),
        0,
      ),
      maxParkingNumber: Math.max(
        ...building.parkings.flatMap((parking) =>
          parking.floors.flatMap((floor) =>
            floor.spots.map((spot) => Number(spot.number)),
          ),
        ),
        0,
      ),
    }));
  },
  findMany: async () => {
    return await db.query.buildings.findMany();
  },
});
