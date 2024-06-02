import { seed as seedApartments } from './apartments';
import { seed as seedBuildings } from './buildings';
import { seed as seedEntrances } from './entrances';
import { seed as seedRoles } from './roles';
import { seed as seedUsers } from './users';

import 'dotenv/config';

async function init() {
  await process();
}

async function process() {
  await seedRoles();
  await seedUsers();

  const { map: buildingDataMap } = await seedBuildings();
  await seedEntrances(buildingDataMap);
  await seedApartments();
}

init();
