import { redirect } from "next/navigation";

import { LinkApartmentForm } from "@sr2/components/link-apartment-form";
import ResponsiveWrapper from "@sr2/components/responsive-wrapper";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@sr2/components/ui/breadcrumb";
import { auth } from "@sr2/server/auth";
import { models } from "@sr2/server/db/model";
import { submitLinkApartment } from "./actions";

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
      <LinkApartmentForm
        buildings={buildingsWithMaxApartment}
        usedApartments={[]}
        user={user}
      />
    </ResponsiveWrapper>
  );
}
