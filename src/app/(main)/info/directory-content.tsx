"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Search,
  Phone,
  MapPin,
  MessageCircle,
  Globe,
  Command,
  Building,
  AlertTriangle,
  Wrench,
  Users,
  Mail,
  ExternalLink,
  Zap,
  Droplet,
  UserCheck,
  Headphones,
} from "lucide-react";
import Link from "next/link";

import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

type Tag = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  entryCount: number;
  hasChildren: boolean;
  scope?: string;
};

type Entry = {
  id: string;
  slug: string;
  type: string;
  title: string;
  description: string | null;
  icon: string | null;
  contacts: {
    id: string;
    type: string;
    value: string;
    label: string | null;
    isPrimary: number;
  }[];
  tags: { id: string; name: string; slug: string }[];
};

type DirectoryContentProps = {
  initialTags: Tag[];
  initialEntries: { entries: Entry[]; total: number };
};

// Quick access tags - contact-level tags for quick filtering
const QUICK_ACCESS_TAGS = [
  { slug: "konsierzh", icon: UserCheck, label: "Консьержи", color: "bg-blue-500" },
  { slug: "chat", icon: MessageCircle, label: "Чаты", color: "bg-violet-500" },
  { slug: "dispetcher", icon: Headphones, label: "Диспетчерские", color: "bg-green-500" },
  { slug: "elektrik", icon: Zap, label: "Электрики", color: "bg-yellow-500" },
  { slug: "santehnik", icon: Droplet, label: "Сантехники", color: "bg-cyan-500" },
];

// Contact type colors
const CONTACT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  phone: { bg: "bg-green-50 dark:bg-green-950/30", border: "border-green-300 dark:border-green-800", text: "text-green-700 dark:text-green-300" },
  telegram: { bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-300 dark:border-blue-800", text: "text-blue-700 dark:text-blue-300" },
  whatsapp: { bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-300 dark:border-emerald-800", text: "text-emerald-700 dark:text-emerald-300" },
  email: { bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-300 dark:border-orange-800", text: "text-orange-700 dark:text-orange-300" },
  website: { bg: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-300 dark:border-purple-800", text: "text-purple-700 dark:text-purple-300" },
  address: { bg: "bg-gray-50 dark:bg-gray-950/30", border: "border-gray-300 dark:border-gray-700", text: "text-gray-700 dark:text-gray-300" },
  vk: { bg: "bg-sky-50 dark:bg-sky-950/30", border: "border-sky-300 dark:border-sky-800", text: "text-sky-700 dark:text-sky-300" },
  other: { bg: "bg-slate-50 dark:bg-slate-950/30", border: "border-slate-300 dark:border-slate-700", text: "text-slate-700 dark:text-slate-300" },
};

// Contact type icons
const CONTACT_ICONS: Record<string, typeof Phone> = {
  phone: Phone,
  telegram: MessageCircle,
  whatsapp: MessageCircle,
  email: Mail,
  website: Globe,
  address: MapPin,
  vk: Globe,
  other: ExternalLink,
};

export function DirectoryContent({
  initialTags,
}: DirectoryContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagSlug, setSelectedTagSlug] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastTrackedSearchRef = useRef<string>("");

  // Analytics tracking mutation
  const trackEvent = api.directory.trackEvent.useMutation();

  // CMD+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
        setSearchQuery("");
        setSelectedTagSlug(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Contact search results (new granular search)
  const contactResults = api.directory.searchContacts.useQuery(
    { query: searchQuery, limit: 50 },
    { enabled: searchQuery.length >= 2 }
  );

  // Contacts by tag (when a tag is clicked)
  const contactsByTag = api.directory.contactsByTag.useQuery(
    { tagSlug: selectedTagSlug ?? "", limit: 50 },
    { enabled: !!selectedTagSlug }
  );

  // Track search events (debounced via useEffect)
  useEffect(() => {
    if (
      searchQuery.length >= 2 &&
      contactResults.data &&
      lastTrackedSearchRef.current !== searchQuery
    ) {
      const timeoutId = setTimeout(() => {
        if (lastTrackedSearchRef.current !== searchQuery) {
          lastTrackedSearchRef.current = searchQuery;
          trackEvent.mutate({
            eventType: "search",
            searchQuery,
            resultsCount: contactResults.data?.total ?? 0,
          });
        }
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, contactResults.data, trackEvent]);

  // Determine state
  const isSearching = searchQuery.length >= 2;
  const isFiltering = !!selectedTagSlug;
  const hasActiveQuery = isSearching || isFiltering;

  // Get displayed contacts
  const displayContacts = isSearching
    ? contactResults.data?.contacts ?? []
    : isFiltering
      ? contactsByTag.data?.contacts ?? []
      : [];

  const matchedTags = isSearching ? contactResults.data?.matchedTags ?? [] : [];

  const handleTagClick = useCallback(
    (slug: string, tagId?: string) => {
      setSelectedTagSlug(slug);
      setSearchQuery("");

      if (tagId) {
        trackEvent.mutate({
          eventType: "tag_click",
          tagId,
        });
      }
    },
    [trackEvent]
  );

  const handleClearFilter = () => {
    setSelectedTagSlug(null);
    setSearchQuery("");
    inputRef.current?.focus();
  };

  // Get quick access tags from initial data (use contact-level tags)
  const quickTags = QUICK_ACCESS_TAGS.map((qt) => {
    const tag = initialTags.find((t) => t.slug === qt.slug);
    return { ...qt, tag };
  });

  return (
    <div className="flex flex-col min-h-[60vh]">
      {/* Search Section */}
      <div
        className={cn(
          "transition-all duration-300 ease-out",
          hasActiveQuery
            ? "pt-0"
            : "flex-1 flex items-center justify-center"
        )}
      >
        <div
          className={cn(
            "w-full transition-all duration-300",
            hasActiveQuery ? "max-w-full" : "max-w-xl mx-auto px-4"
          )}
        >
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="консьерж, чат, электрик, строение 1..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.length >= 2) {
                  setSelectedTagSlug(null);
                }
              }}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={cn(
                "h-14 pl-12 pr-24 text-lg transition-shadow",
                "border-2",
                isSearchFocused
                  ? "border-primary shadow-lg"
                  : "border-border hover:border-primary/50"
              )}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
                <Command className="inline h-3 w-3" />
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">K</kbd>
            </div>
          </div>

          {/* Quick Access Tags - only show when not searching */}
          {!hasActiveQuery && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {quickTags.map(({ slug, icon: Icon, label, color, tag }) => (
                <button
                  key={slug}
                  onClick={() => handleTagClick(slug, tag?.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full",
                    "bg-secondary hover:bg-secondary/80 transition-colors",
                    "text-sm font-medium"
                  )}
                >
                  <span className={cn("w-2 h-2 rounded-full", color)} />
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {hasActiveQuery && (
        <div className="mt-6 flex-1">
          {/* Filter indicator */}
          <div className="flex items-center flex-wrap gap-2 mb-4 text-sm">
            {isSearching && (
              <>
                <span className="text-muted-foreground">
                  Поиск: &quot;{searchQuery}&quot;
                </span>
                {matchedTags.length > 0 && (
                  <span className="text-muted-foreground">→</span>
                )}
                {matchedTags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="gap-1">
                    {tag.name}
                  </Badge>
                ))}
                {contactResults.data && (
                  <span className="text-muted-foreground">
                    ({contactResults.data.total} контактов)
                  </span>
                )}
              </>
            )}
            {isFiltering && contactsByTag.data?.tag && (
              <Badge variant="secondary" className="gap-1">
                {contactsByTag.data.tag.name}
                <span className="text-muted-foreground">
                  ({contactsByTag.data.total})
                </span>
              </Badge>
            )}
            <button
              onClick={handleClearFilter}
              className="text-primary hover:underline text-sm"
            >
              Очистить
            </button>
          </div>

          {/* Loading */}
          {(contactResults.isLoading || contactsByTag.isLoading) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!contactResults.isLoading &&
            !contactsByTag.isLoading &&
            displayContacts.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                {isSearching ? "Ничего не найдено" : "Нет контактов с этим тегом"}
              </div>
            )}

          {/* Contact cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {displayContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onPhoneClick={(contactId) =>
                  trackEvent.mutate({
                    eventType: "entry_call",
                    contactId,
                  })
                }
                onLinkClick={(contactId) =>
                  trackEvent.mutate({
                    eventType: "entry_link",
                    contactId,
                  })
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Hint when not searching */}
      {!hasActiveQuery && (
        <div className="text-center text-sm text-muted-foreground mt-8">
          Попробуйте: «консьерж», «чат строение 1», «электрик»
        </div>
      )}
    </div>
  );
}

// Compact contact card
function ContactCard({
  contact,
  onPhoneClick,
  onLinkClick,
}: {
  contact: {
    id: string;
    type: string;
    value: string;
    label: string | null;
    subtitle: string | null;
    is24h: number;
    entryTitle: string;
    entrySlug: string;
    tags: { id: string; name: string; slug: string }[];
  };
  onPhoneClick?: (contactId: string) => void;
  onLinkClick?: (contactId: string) => void;
}) {
  const colors = CONTACT_COLORS[contact.type] ?? CONTACT_COLORS.other ?? { bg: "bg-slate-50", border: "border-slate-300", text: "text-slate-700" };
  const Icon = CONTACT_ICONS[contact.type] ?? ExternalLink;

  const handleClick = () => {
    if (contact.type === "phone") {
      onPhoneClick?.(contact.id);
    } else {
      onLinkClick?.(contact.id);
    }
  };

  // Build contact URL/href
  let href: string;
  switch (contact.type) {
    case "phone":
      href = `tel:${contact.value}`;
      break;
    case "telegram":
      href = contact.value.startsWith("http")
        ? contact.value
        : `https://t.me/${contact.value.replace("@", "")}`;
      break;
    case "whatsapp":
      href = contact.value.startsWith("http")
        ? contact.value
        : `https://wa.me/${contact.value.replace(/\D/g, "")}`;
      break;
    case "email":
      href = `mailto:${contact.value}`;
      break;
    case "website":
    case "vk":
      href = contact.value;
      break;
    default:
      href = contact.value;
  }

  const isExternalLink = ["telegram", "whatsapp", "website", "vk"].includes(contact.type);

  return (
    <div
      className={cn(
        "rounded-lg border-2 p-3 transition-all hover:shadow-md",
        colors.bg,
        colors.border
      )}
    >
      {/* Header: Entry title + 24h badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <Link
          href={`/info/${contact.entrySlug}`}
          className="text-xs font-medium text-muted-foreground hover:text-foreground truncate"
        >
          {contact.entryTitle}
        </Link>
        {contact.is24h === 1 && (
          <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 rounded">
            24/7
          </span>
        )}
      </div>

      {/* Main contact info */}
      <a
        href={href}
        target={isExternalLink ? "_blank" : undefined}
        rel={isExternalLink ? "noopener noreferrer" : undefined}
        onClick={handleClick}
        className={cn(
          "flex items-center gap-2 font-medium",
          colors.text,
          "hover:opacity-80 transition-opacity"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">
          {contact.type === "phone" ? contact.value : contact.label ?? contact.value}
        </span>
      </a>

      {/* Label/subtitle */}
      {(contact.label || contact.subtitle) && contact.type === "phone" && (
        <div className="mt-1 text-sm text-muted-foreground truncate">
          {contact.label}
          {contact.label && contact.subtitle && " — "}
          {contact.subtitle}
        </div>
      )}
      {contact.subtitle && contact.type !== "phone" && (
        <div className="mt-1 text-sm text-muted-foreground truncate">
          {contact.subtitle}
        </div>
      )}

      {/* Tags */}
      {contact.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {contact.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="text-[10px] px-1.5 py-0.5 bg-muted rounded-full text-muted-foreground"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
