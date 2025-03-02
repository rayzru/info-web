"use server";

// import { models } from "@sr2/server/db/model";

export async function submitLinkApartment(data: {
  buildingId: string;
  apartmentNumber: number;
  userId: string;
}) {
  const { buildingId, apartmentNumber, userId } = data;

  // const user = await models.users.findMany({
  //   where: (table, { eq }) => eq(table.id, userId),
  // });

  return { success: true };
}
