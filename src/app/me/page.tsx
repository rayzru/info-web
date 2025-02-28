import { Avatar } from "@radix-ui/react-avatar";
import ResponsiveWrapper from "@sr2/components/responsive-wrapper";
import { AvatarFallback, AvatarImage } from "@sr2/components/ui/avatar";
import { Button } from "@sr2/components/ui/button";
import { auth } from "@sr2/server/auth";
import { Edit, HomeIcon, HousePlusIcon, ParkingCircleIcon, Plus, PlusIcon } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  const userName = session?.user?.name ?? "Я";
  const userEmail = session?.user?.email ?? "";
  const userImage = session?.user?.image ?? "";

  return (
      <ResponsiveWrapper className="mt-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4 items-center">
          <Avatar className="h-12 w-12">
            <AvatarImage src={userImage} alt="" className="rounded-full" />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
          <Button variant="ghost" className="h-8 w-8" asChild>
            <a href="/me/edit-profile">
              <Edit />
            </a>
          </Button>
        </div>

        <div className="flex flex-row gap-4 items-center">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              <HomeIcon />
            </AvatarFallback>
          </Avatar>
          <h4>Квартира</h4>
          <Button variant="ghost" className="h-8 w-8" asChild>
            <a href="/me/link-apartment">
              <PlusIcon />
            </a>
          </Button>
        </div>

        <div className="flex flex-row gap-4 items-center">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              <ParkingCircleIcon />
            </AvatarFallback>
          </Avatar>
          <h4>Парковка</h4>
          <Button variant="ghost" className="h-8 w-8" asChild>
            <a href="/me/add-parking">
              <PlusIcon />
            </a>
          </Button>
        </div>
      </div>
      </ResponsiveWrapper>
  );
}
