import ResponsiveWrapper from "@sr2/components/responsive-wrapper";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@sr2/components/ui/breadcrumb";

export default async function AddFlatPage() {
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

      
    </ResponsiveWrapper>
  );
}
