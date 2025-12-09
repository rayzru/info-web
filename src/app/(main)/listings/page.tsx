import { Car, Home, Package, Tag, Wrench } from "lucide-react";
import Link from "next/link";

import { Badge } from "~/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export default function ListingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Tag className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Объявления</h1>
          <p className="text-sm text-muted-foreground">
            Объявления жителей ЖК Сердце Ростова 2
          </p>
        </div>
      </div>

      {/* Category cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {/* Parking */}
        <Link href="/listings/parking">
          <Card className="relative h-full cursor-pointer overflow-hidden transition-all hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg dark:hover:bg-blue-950/30">
            <Car className="absolute -bottom-6 -right-6 h-32 w-32 text-muted-foreground/10" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-xl">Паркинг</CardTitle>
              <CardDescription>
                Аренда и продажа парковочных мест в подземном паркинге
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Realty */}
        <Link href="/listings/realty">
          <Card className="relative h-full cursor-pointer overflow-hidden transition-all hover:bg-green-50 hover:border-green-200 hover:shadow-lg dark:hover:bg-green-950/30">
            <Home className="absolute -bottom-6 -right-6 h-32 w-32 text-muted-foreground/10" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-xl">Недвижимость</CardTitle>
              <CardDescription>
                Аренда и продажа квартир в жилом комплексе
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Services - Coming Soon */}
        <Card className="relative h-full overflow-hidden opacity-50">
          <Badge className="absolute right-4 top-4 z-10 bg-amber-500">Скоро</Badge>
          <Wrench className="absolute -bottom-6 -right-6 h-32 w-32 text-muted-foreground/10" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-xl">Услуги</CardTitle>
            <CardDescription>
              Услуги от жителей и для жителей комплекса
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Marketplace - Coming Soon */}
        <Card className="relative h-full overflow-hidden opacity-50">
          <Badge className="absolute right-4 top-4 z-10 bg-amber-500">Скоро</Badge>
          <Package className="absolute -bottom-6 -right-6 h-32 w-32 text-muted-foreground/10" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-xl">Барахолка</CardTitle>
            <CardDescription>
              Купля-продажа вещей между жителями
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
