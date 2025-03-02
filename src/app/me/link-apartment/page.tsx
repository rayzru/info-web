import { LinkApartmentForm } from "@sr2/components/link-apartment-form";
import ResponsiveWrapper from "@sr2/components/responsive-wrapper";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@sr2/components/ui/breadcrumb";
import { models } from "@sr2/server/db/model";

export default async function AddFlatPage() {
  const buildings = await models.buildings.findMany();

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
      <LinkApartmentForm buildings={buildings} />
    </ResponsiveWrapper>
  );
}
