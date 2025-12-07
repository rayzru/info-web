"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Building2,
  Crown,
  Eye,
  Home,
  Pencil,
  Shield,
  User,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

import { YandexLogo } from "./social-icons/yandex";

// Test accounts configuration - same as server
const TEST_ACCOUNTS = {
  admin: {
    name: "Test Admin",
    email: "admin@test.local",
    roles: ["Root", "SuperAdmin", "Admin"],
    icon: Crown,
    color: "text-yellow-600",
  },
  moderator: {
    name: "Test Moderator",
    email: "moderator@test.local",
    roles: ["Moderator"],
    icon: Shield,
    color: "text-blue-600",
  },
  owner: {
    name: "Test Owner",
    email: "owner@test.local",
    roles: ["ApartmentOwner", "ParkingOwner"],
    icon: Building2,
    color: "text-green-600",
  },
  resident: {
    name: "Test Resident",
    email: "resident@test.local",
    roles: ["ApartmentResident"],
    icon: Home,
    color: "text-purple-600",
  },
  guest: {
    name: "Test Guest",
    email: "guest@test.local",
    roles: ["Guest"],
    icon: User,
    color: "text-gray-600",
  },
  editor: {
    name: "Test Editor",
    email: "editor@test.local",
    roles: ["Editor"],
    icon: Pencil,
    color: "text-orange-600",
  },
};

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  showTestAccounts?: boolean;
}

export function LoginForm({
  className,
  showTestAccounts = false,
  ...props
}: Readonly<LoginFormProps>) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/my";

  const handleTestLogin = async (accountKey: string) => {
    await signIn("test-credentials", {
      account: accountKey,
      callbackUrl,
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <h1 className="text-2xl">Парадная</h1>

      <form>
        <div className="flex flex-col gap-6">
          <Button
            key={"yandex"}
            variant="outline"
            type="button"
            className="min-h-[65px] w-full [&>svg]:size-8"
            onClick={async () => await signIn("yandex", { callbackUrl })}
            data-testid="login-yandex"
          >
            <YandexLogo />
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Еще не регистрировались?{" "}
          <a href="#" className="underline underline-offset-4">
            Зарегистрируйтесь
          </a>
        </div>
      </form>

      {/* Development Test Accounts */}
      {showTestAccounts && (
        <>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>Development Test Accounts</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(TEST_ACCOUNTS).map(([key, account]) => {
                const Icon = account.icon;
                return (
                  <Button
                    key={key}
                    variant="outline"
                    type="button"
                    className="flex h-auto flex-col items-start gap-1 p-3"
                    onClick={() => handleTestLogin(key)}
                    data-testid={`login-test-${key}`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={cn("h-4 w-4", account.color)} />
                      <span className="font-medium">{account.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {account.roles.map((role) => (
                        <span
                          key={role}
                          className="text-[10px] rounded bg-muted px-1"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
