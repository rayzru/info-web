import { buildings } from "./models/buildings";
import { users } from "./models/users";
import { db } from "./index";

export * from "./schemas/buildings";
export * from "./schemas/contacts";
export * from "./schemas/organizations";
export * from "./schemas/parkings";
export * from "./schemas/posts";
export * from "./schemas/users";

export const models = {
  buildings: buildings({ db }),
  users: users({ db }),
};
