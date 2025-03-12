"use server";

// import { models } from "~/server/db/model";

export async function submitAddProperty(data: {
  buildingId: string;
  number: number;
  type: "apartment" | "parking";
  userId: string;
}) {
  const { buildingId, number, type, userId } = data;
  console.log(data);
  // const user = await models.users.findMany({
  //   where: (table, { eq }) => eq(table.id, userId),
  // });

  return { success: true };
}
