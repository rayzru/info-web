"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Building,
  Droplet,
  ExternalLink,
  FileText,
  Globe,
  Headphones,
  HelpCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  UserCheck,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";

import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { KeyboardShortcut } from "~/components/keyboard-shortcut";
import { cn } from "~/lib/utils";

// Склонение слова "запись" для русского языка
function pluralizeRecords(count: number): string {
  const lastTwo = count % 100;
  const lastOne = count % 10;

  if (lastTwo >= 11 && lastTwo <= 19) {
    return `${count} записей`;
  }
  if (lastOne === 1) {
    return `${count} запись`;
  }
  if (lastOne >= 2 && lastOne <= 4) {
    return `${count} записи`;
  }
  return `${count} записей`;
}

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

// Tag groups for quick access
const TAG_GROUPS = {
  services: {
    title: "Полезное",
    tags: [
      { slug: "konsierzh", icon: UserCheck, label: "Консьержи" },
      { slug: "chat", icon: MessageCircle, label: "Чаты" },
    ],
  },
  emergency: {
    title: "Аварийные",
    tags: [
      { slug: "dispetcher", icon: Headphones, label: "Диспетчерские" },
      { slug: "elektrik", icon: Zap, label: "Электрики" },
      { slug: "santehnik", icon: Droplet, label: "Сантехники" },
    ],
  },
  buildings: {
    title: "Строения",
    tags: [
      { slug: "stroenie-1", label: "1" },
      { slug: "stroenie-2", label: "2" },
      { slug: "stroenie-3", label: "3" },
      { slug: "stroenie-4", label: "4" },
      { slug: "stroenie-5", label: "5" },
      { slug: "stroenie-6", label: "6" },
      { slug: "stroenie-7", label: "7" },
    ],
  },
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

  // Knowledge base articles search
  const articlesResults = api.knowledge.search.useQuery(
    { query: searchQuery, limit: 5 },
    { enabled: searchQuery.length >= 2 }
  );

  // Contacts by tag (when a tag is clicked) - flat list
  const contactsByTag = api.directory.contactsByTag.useQuery(
    { tagSlug: selectedTagSlug ?? "", limit: 50 },
    { enabled: !!selectedTagSlug }
  );

  // Entries grouped by child tags (for hierarchical display)
  const entriesGrouped = api.directory.entriesGroupedByTag.useQuery(
    { tagSlug: selectedTagSlug ?? "", limit: 50 },
    { enabled: !!selectedTagSlug }
  );

  // Knowledge base articles by tag (when a tag is clicked)
  const articlesByTag = api.knowledge.getByTag.useQuery(
    { tagSlug: selectedTagSlug ?? "", limit: 10 },
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

  // Group contacts by entry for search results
  const searchEntriesGrouped = useMemo(() => {
    if (!isSearching || !contactResults.data?.contacts) return [];

    const entriesMap = new Map<
      string,
      {
        id: string;
        slug: string;
        title: string;
        subtitle: string | null;
        icon: string | null;
        contacts: typeof displayContacts;
      }
    >();

    for (const contact of contactResults.data.contacts) {
      const entryId = contact.entryId;
      if (!entriesMap.has(entryId)) {
        entriesMap.set(entryId, {
          id: entryId,
          slug: contact.entrySlug,
          title: contact.entryTitle,
          subtitle: null,
          icon: contact.entryIcon,
          contacts: [],
        });
      }
      entriesMap.get(entryId)!.contacts.push(contact);
    }

    return Array.from(entriesMap.values());
  }, [isSearching, contactResults.data?.contacts]);

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

  // Map tag groups with actual tag data from DB
  const tagGroups = {
    services: {
      ...TAG_GROUPS.services,
      tags: TAG_GROUPS.services.tags.map((t) => ({
        ...t,
        tag: initialTags.find((it) => it.slug === t.slug),
      })),
    },
    emergency: {
      ...TAG_GROUPS.emergency,
      tags: TAG_GROUPS.emergency.tags.map((t) => ({
        ...t,
        tag: initialTags.find((it) => it.slug === t.slug),
      })),
    },
    buildings: {
      ...TAG_GROUPS.buildings,
      tags: TAG_GROUPS.buildings.tags.map((t) => ({
        ...t,
        tag: initialTags.find((it) => it.slug === t.slug),
      })),
    },
  };

  return (
    <div className="flex flex-col min-h-[40vh]">
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
              placeholder="Что вас интересует?"
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
                "h-14 pl-12 text-lg transition-shadow rounded-full",
                hasActiveQuery ? "pr-28" : "pr-24",
                "border-2",
                isSearchFocused
                  ? "border-primary shadow-lg shadow-primary/20"
                  : "border-primary/30 hover:border-primary/50"
              )}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {/* Clear button (X) */}
              {hasActiveQuery && (
                <button
                  type="button"
                  onClick={handleClearFilter}
                  className="p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  aria-label="Очистить поиск"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {/* CMD+K / CTRL+K hint */}
              <KeyboardShortcut shortcutKey="K" />
            </div>
          </div>

          {/* Quick Access Tags - only show when not searching */}
          {!hasActiveQuery && (
            <>
              {/* Mobile layout: stacked groups with horizontal tags */}
              <div className="mt-6 flex flex-col gap-4 md:hidden">
                {/* Services group */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground font-medium lowercase">
                    {tagGroups.services.title}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tagGroups.services.tags.map(({ slug, icon: Icon, label, tag }) => (
                      <button
                        key={slug}
                        onClick={() => handleTagClick(slug, tag?.id)}
                        className={cn(
                          "group flex items-center gap-1.5 px-3 py-1.5 rounded-full max-w-[140px] cursor-pointer",
                          "bg-background border border-primary/20",
                          "hover:border-primary hover:shadow-sm",
                          "transition-all duration-150",
                          "text-sm"
                        )}
                      >
                        {Icon && <Icon className="h-3.5 w-3.5 shrink-0 opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all" />}
                        <span className="truncate">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Emergency group */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground font-medium lowercase">
                    {tagGroups.emergency.title}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tagGroups.emergency.tags.map(({ slug, icon: Icon, label, tag }) => (
                      <button
                        key={slug}
                        onClick={() => handleTagClick(slug, tag?.id)}
                        className={cn(
                          "group flex items-center gap-1.5 px-3 py-1.5 rounded-full max-w-[140px] cursor-pointer",
                          "bg-background border border-primary/20",
                          "hover:border-primary hover:shadow-sm",
                          "transition-all duration-150",
                          "text-sm"
                        )}
                      >
                        {Icon && <Icon className="h-3.5 w-3.5 shrink-0 opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all" />}
                        <span className="truncate">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buildings group */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-muted-foreground font-medium lowercase">
                    {tagGroups.buildings.title}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tagGroups.buildings.tags.map(({ slug, label, tag }) => (
                      <button
                        key={slug}
                        onClick={() => handleTagClick(slug, tag?.id)}
                        className={cn(
                          "group flex items-center justify-center gap-1 w-12 h-8 rounded-full cursor-pointer",
                          "bg-background border border-primary/20",
                          "hover:border-primary hover:shadow-sm",
                          "transition-all duration-150",
                          "text-sm"
                        )}
                      >
                        <Building className="h-3.5 w-3.5 shrink-0 opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop layout: 3 columns */}
              <div className="mt-6 hidden md:grid grid-cols-3 gap-6 max-w-xl mx-auto">
                {/* Services column */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground font-medium lowercase">
                    {tagGroups.services.title}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {tagGroups.services.tags.map(({ slug, icon: Icon, label, tag }) => (
                      <button
                        key={slug}
                        onClick={() => handleTagClick(slug, tag?.id)}
                        className={cn(
                          "group flex items-center gap-2 px-3 py-1.5 rounded-full w-fit cursor-pointer",
                          "bg-background border border-primary/20",
                          "hover:border-primary hover:shadow-sm",
                          "transition-all duration-150",
                          "text-sm"
                        )}
                      >
                        {Icon && <Icon className="h-4 w-4 shrink-0 opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all" />}
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Emergency column */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground font-medium lowercase">
                    {tagGroups.emergency.title}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {tagGroups.emergency.tags.map(({ slug, icon: Icon, label, tag }) => (
                      <button
                        key={slug}
                        onClick={() => handleTagClick(slug, tag?.id)}
                        className={cn(
                          "group flex items-center gap-2 px-3 py-1.5 rounded-full w-fit cursor-pointer",
                          "bg-background border border-primary/20",
                          "hover:border-primary hover:shadow-sm",
                          "transition-all duration-150",
                          "text-sm"
                        )}
                      >
                        {Icon && <Icon className="h-4 w-4 shrink-0 opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all" />}
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buildings column */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-muted-foreground font-medium lowercase">
                    {tagGroups.buildings.title}
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {tagGroups.buildings.tags.map(({ slug, label, tag }) => (
                      <button
                        key={slug}
                        onClick={() => handleTagClick(slug, tag?.id)}
                        className={cn(
                          "group flex items-center justify-center gap-1 h-8 rounded-full cursor-pointer",
                          "bg-background border border-primary/20",
                          "hover:border-primary hover:shadow-sm",
                          "transition-all duration-150",
                          "text-sm"
                        )}
                      >
                        <Building className="h-3.5 w-3.5 shrink-0 opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Results Section */}
      {hasActiveQuery && (
        <div className="mt-6 flex-1">
          {/* Filter indicator */}
          <div className="flex items-center justify-between mb-4 text-sm">
            <div className="flex items-center flex-wrap gap-1.5">
              {isSearching && matchedTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleTagClick(tag.slug, tag.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-full cursor-pointer",
                    "bg-background border border-primary/20",
                    "hover:border-primary hover:shadow-sm",
                    "transition-all duration-150",
                    "text-sm text-foreground/80"
                  )}
                >
                  {tag.name}
                </button>
              ))}
              {isFiltering && contactsByTag.data?.tag && (() => {
                const tag = contactsByTag.data.tag;
                return (
                  <button
                    onClick={() => handleTagClick(tag.slug, tag.id)}
                    className={cn(
                      "px-2.5 py-1 rounded-full cursor-pointer",
                      "bg-primary/10 border border-primary/30",
                      "text-sm text-primary font-medium"
                    )}
                  >
                    {tag.name}
                  </button>
                );
              })()}
            </div>
            <span className="text-muted-foreground text-sm shrink-0 ml-4">
              {isSearching && contactResults.data && (
                pluralizeRecords(contactResults.data.total)
              )}
              {isFiltering && entriesGrouped.data && entriesGrouped.data.groups.length > 0 && (
                pluralizeRecords(entriesGrouped.data.total)
              )}
              {isFiltering && entriesGrouped.data?.groups.length === 0 && contactsByTag.data && (
                pluralizeRecords(contactsByTag.data.total)
              )}
            </span>
          </div>

          {/* Loading */}
          {(contactResults.isLoading || contactsByTag.isLoading || entriesGrouped.isLoading) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!contactResults.isLoading &&
            !contactsByTag.isLoading &&
            !entriesGrouped.isLoading &&
            displayContacts.length === 0 &&
            (!entriesGrouped.data || entriesGrouped.data.groups.length === 0) && (
              <div className="py-12 text-center text-muted-foreground">
                {isSearching ? "Ничего не найдено" : "Нет контактов с этим тегом"}
              </div>
            )}

          {/* Knowledge base articles (when searching or filtering by tag) */}
          {(() => {
            const articles = isSearching
              ? articlesResults.data?.articles
              : isFiltering
                ? articlesByTag.data?.articles
                : null;

            if (!articles || articles.length === 0) return null;

            return (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Полезные статьи</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {articles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      onTagClick={handleTagClick}
                    />
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Search results - grouped by entry */}
          {isSearching && searchEntriesGrouped.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchEntriesGrouped.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
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
                  onTagClick={handleTagClick}
                />
              ))}
            </div>
          ) : /* Grouped entries (when filtering by tag) */
          isFiltering && entriesGrouped.data && entriesGrouped.data.groups.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {entriesGrouped.data.groups.flatMap((group) =>
                group.entries.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
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
                    onTagClick={handleTagClick}
                  />
                ))
              )}
            </div>
          ) : (
            /* Contact cards grid (flat list fallback) */
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
                  onTagClick={handleTagClick}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hint when not searching */}
      {!hasActiveQuery && <SearchHint onHintClick={(hint) => {
        setSearchQuery(hint);
        inputRef.current?.focus();
      }} />}
    </div>
  );
}

// Popular search hints for random selection
const SEARCH_HINTS = [
  "консьерж",
  "электрик",
  "сантехник",
  "чат",
  "диспетчер",
  "лифт",
  "домофон",
  "ук",
  "паркинг",
  "интернет",
  "уборка",
];

// Generate random pair of hints
function getRandomHintPair(): [string, string] {
  const shuffled = [...SEARCH_HINTS].sort(() => Math.random() - 0.5);
  return [shuffled[0]!, shuffled[1]!];
}

// Animated search hint component
function SearchHint({ onHintClick }: { onHintClick: (hint: string) => void }) {
  const [hintPair, setHintPair] = useState<[string, string] | null>(null);
  const [key, setKey] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Initial appearance and first pair after 300ms
  useEffect(() => {
    // Show container first
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Then show first pair after 300ms
    const pairTimer = setTimeout(() => {
      setHintPair(getRandomHintPair());
    }, 300);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(pairTimer);
    };
  }, []);

  // Change hint pair every 60 seconds
  useEffect(() => {
    if (!hintPair) return;

    const interval = setInterval(() => {
      setHintPair(getRandomHintPair());
      setKey((k) => k + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, [hintPair]);

  return (
    <motion.div
      className="mt-8 flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/30 text-sm text-muted-foreground/70">
        <HelpCircle className="h-3.5 w-3.5 shrink-0 opacity-50" />
        <span className="opacity-70">попробуйте</span>
        <AnimatePresence mode="wait">
          {hintPair && (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-center gap-1.5"
            >
              <button
                onClick={() => onHintClick(hintPair[0])}
                className={cn(
                  "px-2.5 py-1 rounded-full cursor-pointer",
                  "bg-background border border-primary/20",
                  "hover:border-primary hover:shadow-sm",
                  "transition-all duration-150",
                  "text-foreground/80"
                )}
              >
                {hintPair[0]}
              </button>
              <span className="opacity-50">или</span>
              <button
                onClick={() => onHintClick(hintPair[1])}
                className={cn(
                  "px-2.5 py-1 rounded-full cursor-pointer",
                  "bg-background border border-primary/20",
                  "hover:border-primary hover:shadow-sm",
                  "transition-all duration-150",
                  "text-foreground/80"
                )}
              >
                {hintPair[1]}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <KeyboardShortcut shortcutKey="K" className="opacity-50" />
      </div>
    </motion.div>
  );
}

// Contact card - light design with focus on readability
function ContactCard({
  contact,
  onPhoneClick,
  onLinkClick,
  onTagClick,
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
  onTagClick?: (tagSlug: string, tagId: string) => void;
}) {
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

  // Display text for contact
  const contactDisplayText = contact.type === "phone"
    ? contact.value
    : contact.label ?? contact.value;

  // Subtitle for phone includes label + subtitle
  const phoneSubtitle = contact.type === "phone" && (contact.label || contact.subtitle)
    ? [contact.label, contact.subtitle].filter(Boolean).join(" — ")
    : null;

  return (
    <div className="relative rounded-lg border bg-card p-4 transition-all hover:shadow-md hover:border-primary/30 overflow-hidden flex flex-col min-h-[140px]">
      {/* Icon in corner - like listings page */}
      <Icon className="absolute -bottom-4 -right-4 h-20 w-20 text-muted-foreground/10" />

      {/* Header: Entry title (smaller, not primary) + 24h badge */}
      <div className="relative flex items-start justify-between gap-2 mb-1">
        <Link
          href={`/info/${contact.entrySlug}`}
          className="text-md text-muted-foreground hover:text-foreground transition-colors truncate"
        >
          {contact.entryTitle}
        </Link>
        {contact.is24h === 1 && (
          <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded">
            24/7
          </span>
        )}
      </div>

      {/* Subtitle */}
      <div className="relative mt-1 text-sm text-muted-foreground truncate">
        {contact.subtitle && contact.type !== "phone" && contact.subtitle}
        {phoneSubtitle && phoneSubtitle}
      </div>

      {/* Main contact info - large and prominent */}
      <a
        href={href}
        target={isExternalLink ? "_blank" : undefined}
        rel={isExternalLink ? "noopener noreferrer" : undefined}
        onClick={handleClick}
        className="group relative block mt-2"
      >
        <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {contactDisplayText}
        </span>
      </a>

      {/* Tags - styled like search badges, pinned to bottom */}
      {contact.tags.length > 0 && (
        <div className="relative mt-auto pt-3 flex flex-wrap gap-1.5">
          {contact.tags.slice(0, 3).map((tag) => (
            <button
              key={tag.id}
              onClick={() => onTagClick?.(tag.slug, tag.id)}
              className={cn(
                "text-[11px] px-2 py-0.5 rounded-full cursor-pointer",
                "bg-background border border-primary/20 text-muted-foreground",
                "hover:border-primary hover:text-foreground",
                "transition-all duration-150"
              )}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Entry card - shows entry with all its contacts
function EntryCard({
  entry,
  onPhoneClick,
  onLinkClick,
  onTagClick,
}: {
  entry: {
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    icon: string | null;
    contacts: {
      id: string;
      type: string;
      value: string;
      label: string | null;
      subtitle: string | null;
      isPrimary: number;
      hasWhatsApp: number;
      hasTelegram: number;
      is24h: number;
      order: number | null;
    }[];
  };
  onPhoneClick?: (contactId: string) => void;
  onLinkClick?: (contactId: string) => void;
  onTagClick?: (tagSlug: string, tagId: string) => void;
}) {
  // Group contacts by type for better organization
  const phoneContacts = entry.contacts.filter((c) => c.type === "phone");
  const messengerContacts = entry.contacts.filter((c) =>
    ["telegram", "whatsapp"].includes(c.type)
  );
  const otherContacts = entry.contacts.filter(
    (c) => !["phone", "telegram", "whatsapp"].includes(c.type)
  );

  // Build contact href
  const getContactHref = (contact: typeof entry.contacts[0]) => {
    switch (contact.type) {
      case "phone":
        return `tel:${contact.value}`;
      case "telegram":
        return contact.value.startsWith("http")
          ? contact.value
          : `https://t.me/${contact.value.replace("@", "")}`;
      case "whatsapp":
        return contact.value.startsWith("http")
          ? contact.value
          : `https://wa.me/${contact.value.replace(/\D/g, "")}`;
      case "email":
        return `mailto:${contact.value}`;
      default:
        return contact.value;
    }
  };

  const isExternalLink = (type: string) =>
    ["telegram", "whatsapp", "website", "vk"].includes(type);

  return (
    <div className="rounded-lg border bg-card p-4 transition-all hover:shadow-md hover:border-primary/30 flex flex-col">
      {/* Header: Entry title */}
      <Link
        href={`/info/${entry.slug}`}
        className="group flex items-start justify-between gap-2 mb-3"
      >
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {entry.title}
          </h3>
          {entry.subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {entry.subtitle}
            </p>
          )}
        </div>
        <ExternalLink className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary shrink-0 mt-1" />
      </Link>

      {/* Contacts list */}
      <div className="space-y-2 flex-1">
        {/* Phone contacts */}
        {phoneContacts.map((contact) => (
          <a
            key={contact.id}
            href={getContactHref(contact)}
            onClick={() => onPhoneClick?.(contact.id)}
            className="group flex items-center gap-2 py-1.5 px-2 -mx-2 rounded-md hover:bg-muted/50 transition-colors"
          >
            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {contact.value}
                </span>
                {contact.is24h === 1 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded">
                    24/7
                  </span>
                )}
              </div>
              {(contact.label || contact.subtitle) && (
                <span className="text-xs text-muted-foreground">
                  {[contact.label, contact.subtitle].filter(Boolean).join(" — ")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {contact.hasWhatsApp === 1 && (
                <a
                  href={`https://wa.me/${contact.value.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLinkClick?.(contact.id);
                  }}
                  className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-900/30"
                  title="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4 text-green-600" />
                </a>
              )}
              {contact.hasTelegram === 1 && (
                <a
                  href={`https://t.me/+${contact.value.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLinkClick?.(contact.id);
                  }}
                  className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  title="Telegram"
                >
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                </a>
              )}
            </div>
          </a>
        ))}

        {/* Messenger contacts (Telegram, WhatsApp links) */}
        {messengerContacts.map((contact) => {
          const Icon = CONTACT_ICONS[contact.type] ?? MessageCircle;
          return (
            <a
              key={contact.id}
              href={getContactHref(contact)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onLinkClick?.(contact.id)}
              className="group flex items-center gap-2 py-1.5 px-2 -mx-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  contact.type === "whatsapp" && "text-green-600",
                  contact.type === "telegram" && "text-blue-500"
                )}
              />
              <div className="min-w-0 flex-1">
                <span className="text-sm group-hover:text-primary transition-colors">
                  {contact.label ?? contact.value}
                </span>
                {contact.subtitle && (
                  <span className="text-xs text-muted-foreground ml-2">
                    {contact.subtitle}
                  </span>
                )}
              </div>
            </a>
          );
        })}

        {/* Other contacts (email, website, address, etc.) */}
        {otherContacts.map((contact) => {
          const Icon = CONTACT_ICONS[contact.type] ?? ExternalLink;
          const isLink = isExternalLink(contact.type) || contact.type === "email";
          const href = getContactHref(contact);

          return (
            <a
              key={contact.id}
              href={href}
              target={isLink ? "_blank" : undefined}
              rel={isLink ? "noopener noreferrer" : undefined}
              onClick={() => onLinkClick?.(contact.id)}
              className="group flex items-center gap-2 py-1.5 px-2 -mx-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-sm group-hover:text-primary transition-colors truncate block">
                  {contact.label ?? contact.value}
                </span>
                {contact.subtitle && (
                  <span className="text-xs text-muted-foreground block truncate">
                    {contact.subtitle}
                  </span>
                )}
              </div>
            </a>
          );
        })}
      </div>

      {/* Empty state if no contacts */}
      {entry.contacts.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          Нет контактной информации
        </p>
      )}
    </div>
  );
}

// Article card for knowledge base results
function ArticleCard({
  article,
  onTagClick,
}: {
  article: {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    icon: string | null;
    tags: { id: string; name: string; slug: string }[];
  };
  onTagClick?: (tagSlug: string, tagId: string) => void;
}) {
  return (
    <Link
      href={`/howtos/${article.slug}`}
      className="group relative rounded-lg border bg-linear-to-br from-primary/5 to-transparent p-4 transition-all hover:shadow-md hover:border-primary/30 overflow-hidden flex flex-col min-h-30"
    >
      {/* Icon in corner */}
      <FileText className="absolute -bottom-4 -right-4 h-20 w-20 text-primary/10" />

      {/* Title */}
      <h3 className="relative font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 pr-8">
        {article.title}
      </h3>

      {/* Excerpt */}
      {article.excerpt && (
        <p className="relative mt-1.5 text-sm text-muted-foreground line-clamp-2">
          {article.excerpt}
        </p>
      )}

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="relative mt-auto pt-3 flex flex-wrap gap-1.5">
          {article.tags.slice(0, 2).map((tag) => (
            <span
              key={tag.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTagClick?.(tag.slug, tag.id);
              }}
              className={cn(
                "text-[11px] px-2 py-0.5 rounded-full cursor-pointer",
                "bg-background border border-primary/20 text-muted-foreground",
                "hover:border-primary hover:text-foreground",
                "transition-all duration-150"
              )}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
