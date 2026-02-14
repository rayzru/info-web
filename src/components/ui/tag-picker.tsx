"use client";

import * as React from "react";

import { Check, ChevronsUpDown, X } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { cn } from "~/lib/utils";

export type TagOption = {
  id: string;
  name: string;
  subtitle?: string;
  slug: string;
  group?: string;
  synonyms?: string[];
};

type TagPickerProps = {
  options: TagOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  maxDisplay?: number;
};

export function TagPicker({
  options,
  selected,
  onChange,
  placeholder = "Select tags...",
  searchPlaceholder = "Search...",
  emptyText = "No tags found.",
  className,
  disabled = false,
  maxDisplay = 5,
}: TagPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const selectedTags = React.useMemo(
    () => options.filter((opt) => selected.includes(opt.id)),
    [options, selected]
  );

  // Group options by their group property
  const groupedOptions = React.useMemo(() => {
    const groups = new Map<string, TagOption[]>();

    for (const option of options) {
      const groupName = option.group ?? "Other";
      const existing = groups.get(groupName) ?? [];
      groups.set(groupName, [...existing, option]);
    }

    return groups;
  }, [options]);

  // Filter and sort by relevance
  const filteredOptions = React.useMemo(() => {
    if (!searchValue.trim()) return options;

    const query = searchValue.toLowerCase();

    return options
      .map((option) => {
        let score = 0;
        const nameLower = option.name.toLowerCase();
        const subtitleLower = option.subtitle?.toLowerCase() ?? "";
        const slugLower = option.slug.toLowerCase();

        // Exact match in name - highest score
        if (nameLower === query) score = 100;
        // Starts with query in name
        else if (nameLower.startsWith(query)) score = 80;
        // Contains query in name
        else if (nameLower.includes(query)) score = 60;
        // Match in subtitle
        else if (subtitleLower.includes(query)) score = 50;
        // Match in slug
        else if (slugLower.includes(query)) score = 40;
        // Match in synonyms
        else if (option.synonyms?.some((s) => s.toLowerCase().includes(query))) {
          score = 30;
        }

        return { option, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.option);
  }, [options, searchValue]);

  const handleSelect = (optionId: string) => {
    if (selected.includes(optionId)) {
      onChange(selected.filter((id) => id !== optionId));
    } else {
      onChange([...selected, optionId]);
    }
  };

  const handleRemove = (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((id) => id !== optionId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !searchValue && selected.length > 0) {
      onChange(selected.slice(0, -1));
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-auto min-h-9 w-full justify-between font-normal",
            !selected.length && "text-muted-foreground",
            className
          )}
        >
          <div className="flex flex-1 flex-wrap gap-1">
            {selectedTags.length === 0 ? (
              <span>{placeholder}</span>
            ) : (
              <>
                {selectedTags.slice(0, maxDisplay).map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="h-5 py-0 pr-1 text-xs">
                    {tag.name}
                    {tag.subtitle && (
                      <span className="text-muted-foreground ml-1">{tag.subtitle}</span>
                    )}
                    <button
                      type="button"
                      className="hover:bg-secondary-foreground/20 ml-1 rounded-full outline-none"
                      onClick={(e) => handleRemove(tag.id, e)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedTags.length > maxDisplay && (
                  <Badge variant="secondary" className="h-5 py-0 text-xs">
                    +{selectedTags.length - maxDisplay}
                  </Badge>
                )}
              </>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <Command shouldFilter={false} onKeyDown={handleKeyDown}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {searchValue ? (
              // When searching, show flat list sorted by relevance
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.id}
                    onSelect={() => handleSelect(option.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 shrink-0",
                        selected.includes(option.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate">{option.name}</span>
                      {option.subtitle && (
                        <span className="text-muted-foreground truncate text-xs">
                          {option.subtitle}
                        </span>
                      )}
                    </div>
                    {option.group && (
                      <span className="text-muted-foreground ml-2 shrink-0 text-xs">
                        {option.group}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              // When not searching, show grouped list
              Array.from(groupedOptions.entries()).map(([group, groupOptions]) => (
                <CommandGroup key={group} heading={group}>
                  {groupOptions.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={option.id}
                      onSelect={() => handleSelect(option.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 shrink-0",
                          selected.includes(option.id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate">{option.name}</span>
                        {option.subtitle && (
                          <span className="text-muted-foreground truncate text-xs">
                            {option.subtitle}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
