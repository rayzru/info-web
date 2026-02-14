"use client";

import * as React from "react";

import { Mail, MessageCircle, Phone } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/ui/hover-card";
import { getRankConfig, type RankTier, TIER_CONFIG } from "~/lib/ranks";
import { cn } from "~/lib/utils";
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

  const propertyLabel = context.propertyType ? propertyLabels[context.propertyType] : "";
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
    <div className={cn("inline-flex items-center", sizeStyles.gap, className)}>
      {/* Avatar with rank ring */}
      <div className="relative">
        <Avatar
          className={cn(
            sizeStyles.avatar,
            sizeStyles.ring,
            "ring-offset-background ring-offset-2",
            rankConfig.ringColor
          )}
        >
          <AvatarImage src={user.image ?? undefined} alt={displayName} />
          <AvatarFallback
            className={cn("text-xs font-medium", rankConfig.badgeColor, "text-white")}
          >
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Name and status */}
      {showName && (
        <div className="flex min-w-0 flex-col">
          <span className={cn("truncate font-medium", sizeStyles.text)}>{displayName}</span>
          {contextLabel && (
            <span className="text-muted-foreground truncate text-xs">{contextLabel}</span>
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
        <button className="hover:bg-muted/50 -m-1 cursor-pointer rounded-lg p-1 transition-colors">
          {badge}
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        align="start"
        className={cn(
          "w-72 overflow-hidden p-0",
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
          rankConfig.badgeColor.replace("bg-", "from- bg-gradient-to-b") + "/20 to-transparent"
        )}
      >
        {/* Large avatar */}
        <div className="flex items-start gap-4">
          <Avatar
            className={cn(
              "ring-offset-background h-16 w-16 ring-[3px] ring-offset-2",
              rankConfig.ringColor
            )}
          >
            <AvatarImage src={user.image ?? undefined} alt={displayName} />
            <AvatarFallback
              className={cn("text-lg font-medium", rankConfig.badgeColor, "text-white")}
            >
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 pt-1">
            <h4 className="truncate font-semibold">{displayName}</h4>
            <p className={cn("text-sm font-medium", rankConfig.textColor)}>{rankConfig.label}</p>
            {contextLabel && (
              <p className="text-muted-foreground mt-1 truncate text-xs">{contextLabel}</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 pb-4">
        {showPhone && (
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <a href={`tel:${user.phone}`}>
              <Phone className="mr-2 h-4 w-4" />
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
          <MessageCircle className="mr-2 h-4 w-4" />
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
        "overflow-hidden rounded-xl border-2",
        rankConfig.ringColor.replace("ring-", "border-"),
        className
      )}
    >
      <UserCardContent user={user} context={context} rankConfig={rankConfig} />
    </div>
  );
}
