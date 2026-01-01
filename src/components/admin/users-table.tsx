"use client";

import { useState } from "react";
import Link from "next/link";
import { Ban, Building2, KeyRound, MoreHorizontal, Search, Trash2, UserCog, MessageSquareText } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { type UserRole } from "~/server/auth/rbac";
import { getRankConfig } from "~/lib/ranks";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

import { BlockUserDialog } from "./block-user-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";
import { EditTaglineDialog } from "./edit-tagline-dialog";
import { UnblockUserDialog } from "./unblock-user-dialog";

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  roles: UserRole[];
  createdAt: Date | null;
  tagline: string | null;
}

interface UsersTableProps {
  canManageRoles: boolean;
  canDeleteUsers: boolean;
}

function formatDate(date: Date | null): string {
  if (!date) return "—";
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear().toString().slice(-2);
  return `${day}.${month}.${year}`;
}

// Row component to handle block status loading per user
function UserRow({
  user,
  canManageRoles,
  canDeleteUsers,
}: {
  user: User;
  canManageRoles: boolean;
  canDeleteUsers: boolean;
}) {
  const { data: blockStatus } = api.admin.users.getActiveBlock.useQuery(
    { userId: user.id },
    { staleTime: 30000 }
  );

  const isBlocked = !!blockStatus;
  const rankConfig = getRankConfig(user.roles.length > 0 ? user.roles : ["Guest"]);

  return (
    <TableRow key={user.id} className={cn(isBlocked && "bg-destructive/5")}>
      <TableCell>
        <div className="relative">
          <Avatar
            className={cn(
              "h-6 w-6 ring-2 ring-offset-1 ring-offset-background",
              isBlocked ? "ring-destructive/50" : rankConfig.ringColor
            )}
          >
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback
              className={cn(
                "text-[10px]",
                isBlocked ? "bg-destructive/20 text-destructive" : rankConfig.badgeColor,
                !isBlocked && "text-white"
              )}
            >
              {user.name?.slice(0, 2).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          {isBlocked && (
            <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-destructive p-0.5">
              <Ban className="h-2 w-2 text-white" />
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div>
          <div className="flex items-center gap-2">
            <p className={cn("font-medium", isBlocked && "text-destructive")}>
              {user.name ?? "Без имени"}
            </p>
            {isBlocked && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                Заблокирован
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </TableCell>
      <TableCell>
        {user.roles.length > 0 ? (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              rankConfig.badgeColor + "/15",
              rankConfig.textColor
            )}
          >
            {rankConfig.shortLabel}
            {user.roles.length > 1 && (
              <span className="ml-1 text-muted-foreground">(+{user.roles.length - 1})</span>
            )}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDate(user.createdAt)}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canManageRoles && (
              <>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/users/${user.id}/roles`}>
                    <UserCog className="mr-2 h-4 w-4" />
                    Управление ролями
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/admin/users/${user.id}/properties`}>
                    <Building2 className="mr-2 h-4 w-4" />
                    Собственность
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <EditTaglineDialog userId={user.id} userName={user.name} asMenuItem />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Сбросить пароль
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {isBlocked ? (
                  <UnblockUserDialog userId={user.id} userName={user.name} asMenuItem />
                ) : (
                  <BlockUserDialog userId={user.id} userName={user.name} asMenuItem />
                )}
              </>
            )}
            {canDeleteUsers && (
              <>
                {canManageRoles && <DropdownMenuSeparator />}
                <DeleteUserDialog userId={user.id} userName={user.name} asMenuItem />
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export function UsersTable({ canManageRoles, canDeleteUsers }: UsersTableProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = api.admin.users.list.useQuery({
    page,
    limit: 20,
    search: search || undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по имени или email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit">Найти</Button>
      </form>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Пользователь</TableHead>
              <TableHead>Роли</TableHead>
              <TableHead>Регистрация</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Загрузка...
                </TableCell>
              </TableRow>
            ) : data?.users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Пользователи не найдены
                </TableCell>
              </TableRow>
            ) : (
              data?.users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  canManageRoles={canManageRoles}
                  canDeleteUsers={canDeleteUsers}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Страница {data.page} из {data.totalPages} (всего {data.total})
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Назад
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Вперед
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
