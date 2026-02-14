"use client";

import { Shield, User } from "lucide-react";

import { cn } from "~/lib/utils";

type UserPillProps = {
  name: string;
  isAdmin?: boolean;
  isVerified?: boolean;
  isCurrentUser?: boolean;
  avatarUrl?: string | null;
  className?: string;
};

export function UserPill({
  name,
  isAdmin = false,
  isVerified = false,
  isCurrentUser = false,
  avatarUrl,
  className,
}: UserPillProps) {
  // Admin users always show as "Администрация"
  const displayName = isAdmin ? "Администрация" : isCurrentUser ? "Вы" : truncateName(name);

  return (
    <div
      className={cn(
        "bg-muted inline-flex items-center gap-1.5 rounded-full py-0.5 pl-0.5 pr-2.5",
        className
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full",
          isAdmin
            ? "bg-primary text-primary-foreground"
            : isVerified
              ? "bg-muted-foreground/20 ring-2 ring-green-500"
              : "bg-muted-foreground/20"
        )}
      >
        {isAdmin ? (
          <Shield className="h-3 w-3" />
        ) : avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <User className="text-muted-foreground h-3 w-3" />
        )}
      </div>

      {/* Name */}
      <span className="max-w-[120px] truncate text-xs font-medium">{displayName}</span>
    </div>
  );
}

function truncateName(name: string, maxLength = 20): string {
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength - 1) + "…";
}
