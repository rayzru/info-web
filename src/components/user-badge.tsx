"use client";

import * as React from "react";
import { MessageCircle, Phone, Mail } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { cn } from "~/lib/utils";
import { getRankConfig, type RankTier, TIER_CONFIG } from "~/lib/ranks";
import type { UserRole } from "~/server/auth/rbac";

export interface UserBadgeProps {
  user: {
    id: string;
    name?: string | null;
    image?: string | null;
    roles: UserRole[];
    // Privacy settings
    hideName?: boolean;
    hidePhone?: boolean;
    hideMessengers?: boolean;
    // Contact info (shown based on privacy)
    phone?: string | null;
  };
  // Optional building/property context for display
  context?: {
    buildingName?: string;
    propertyType?: "apartment" | "parking" | "store";
    propertyNumber?: string;
  };
  // Size variants
  size?: "sm" | "md" | "lg";
  // Show name next to avatar
  showName?: boolean;
  // Disable hover card
  disableHover?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: {
    avatar: "h-8 w-8",
    ring: "ring-2",
    text: "text-xs",
    gap: "gap-2",
  },
  md: {
    avatar: "h-10 w-10",
    ring: "ring-2",
    text: "text-sm",
    gap: "gap-2.5",
  },
  lg: {
    avatar: "h-12 w-12",
    ring: "ring-[3px]",
    text: "text-base",
    gap: "gap-3",
  },
};

function getInitials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.split(" ").filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getDisplayName(
  user: UserBadgeProps["user"],
  rankConfig: ReturnType<typeof getRankConfig>
): string {
  if (user.hideName || !user.name) {
    return rankConfig.label;
  }
  return user.name;
}

function getContextLabel(
  context?: UserBadgeProps["context"],
  rankConfig?: ReturnType<typeof getRankConfig>
): string | null {
  if (!context?.buildingName) return null;

  const propertyLabels = {
    apartment: "кв.",
    parking: "м/м",
    store: "маг.",
  };

  const propertyLabel = context.propertyType
    ? propertyLabels[context.propertyType]
    : "";
  const propertyNum = context.propertyNumber ? ` ${context.propertyNumber}` : "";

  return `${context.buildingName}${propertyLabel ? `, ${propertyLabel}${propertyNum}` : ""}`;
}

export function UserBadge({
  user,
  context,
  size = "md",
  showName = true,
  disableHover = false,
  className,
}: UserBadgeProps) {
  const rankConfig = getRankConfig(user.roles);
  const sizeStyles = sizeConfig[size];
  const displayName = getDisplayName(user, rankConfig);
  const contextLabel = getContextLabel(context, rankConfig);

  const badge = (
    <div
      className={cn(
        "inline-flex items-center",
        sizeStyles.gap,
        className
      )}
    >
      {/* Avatar with rank ring */}
      <div className="relative">
        <Avatar
          className={cn(
            sizeStyles.avatar,
            sizeStyles.ring,
            "ring-offset-2 ring-offset-background",
            rankConfig.ringColor
          )}
        >
          <AvatarImage src={user.image ?? undefined} alt={displayName} />
          <AvatarFallback className={cn("text-xs font-medium", rankConfig.badgeColor, "text-white")}>
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Name and status */}
      {showName && (
        <div className="flex flex-col min-w-0">
          <span className={cn("font-medium truncate", sizeStyles.text)}>
            {displayName}
          </span>
          {contextLabel && (
            <span className="text-xs text-muted-foreground truncate">
              {contextLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (disableHover) {
    return badge;
  }

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button className="cursor-pointer rounded-lg p-1 -m-1 transition-colors hover:bg-muted/50">
          {badge}
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        align="start"
        className={cn(
          "w-72 p-0 overflow-hidden",
          "border-2",
          rankConfig.ringColor.replace("ring-", "border-")
        )}
      >
        <UserCardContent user={user} context={context} rankConfig={rankConfig} />
      </HoverCardContent>
    </HoverCard>
  );
}

interface UserCardContentProps {
  user: UserBadgeProps["user"];
  context?: UserBadgeProps["context"];
  rankConfig: ReturnType<typeof getRankConfig>;
}

function UserCardContent({ user, context, rankConfig }: UserCardContentProps) {
  const displayName = getDisplayName(user, rankConfig);
  const contextLabel = getContextLabel(context, rankConfig);

  const showPhone = !user.hidePhone && user.phone;
  const showMessage = !user.hideMessengers;

  return (
    <div className="flex flex-col">
      {/* Header with gradient */}
      <div
        className={cn(
          "p-4 pb-6",
          rankConfig.badgeColor.replace("bg-", "bg-gradient-to-b from-") + "/20 to-transparent"
        )}
      >
        {/* Large avatar */}
        <div className="flex items-start gap-4">
          <Avatar
            className={cn(
              "h-16 w-16 ring-[3px] ring-offset-2 ring-offset-background",
              rankConfig.ringColor
            )}
          >
            <AvatarImage src={user.image ?? undefined} alt={displayName} />
            <AvatarFallback className={cn("text-lg font-medium", rankConfig.badgeColor, "text-white")}>
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 pt-1">
            <h4 className="font-semibold truncate">{displayName}</h4>
            <p className={cn("text-sm font-medium", rankConfig.textColor)}>
              {rankConfig.label}
            </p>
            {contextLabel && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {contextLabel}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2">
        {showPhone && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            asChild
          >
            <a href={`tel:${user.phone}`}>
              <Phone className="h-4 w-4 mr-2" />
              Позвонить
            </a>
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={!showMessage}
          title={showMessage ? "Написать сообщение" : "Сообщения скрыты"}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Написать
        </Button>
      </div>
    </div>
  );
}

/**
 * Standalone user card (not hover, full component)
 */
export function UserCard({
  user,
  context,
  className,
}: Omit<UserBadgeProps, "size" | "showName" | "disableHover">) {
  const rankConfig = getRankConfig(user.roles);

  return (
    <div
      className={cn(
        "rounded-xl border-2 overflow-hidden",
        rankConfig.ringColor.replace("ring-", "border-"),
        className
      )}
    >
      <UserCardContent user={user} context={context} rankConfig={rankConfig} />
    </div>
  );
}
