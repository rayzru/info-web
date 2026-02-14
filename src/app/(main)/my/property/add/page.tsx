import { redirect } from "next/navigation";

import { AddPropertyForm } from "~/components/add-property-form";
import ResponsiveWrapper from "~/components/responsive-wrapper";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { auth } from "~/server/auth";
import { models } from "~/server/db/model";

export default async function AddFlatPage() {
  const buildingsWithMaxApartment = await models.buildings.summary();
  const user = await auth();
  if (!user) {
    redirect("/login");
  }
  return (
    <ResponsiveWrapper className="mt-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/me">Профиль</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Привязка квартиры</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <AddPropertyForm buildings={buildingsWithMaxApartment} usedApartments={[]} user={user} />
    </ResponsiveWrapper>
  );
}
