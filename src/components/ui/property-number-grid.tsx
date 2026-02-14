"use client";

import { useMemo, useState } from "react";

import { Check, ChevronDown, Search } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { cn } from "~/lib/utils";

interface PropertyItem {
  id: string;
  number: string;
  disabled?: boolean;
  disabledLabel?: string;
  entranceNumber?: number;
  floorNumber?: number;
}

interface PropertyGroup {
  label: string;
  items: PropertyItem[];
}

interface PropertyNumberGridProps {
  /** Array of property items with id, number, and optional disabled state */
  items?: PropertyItem[];
  /** Grouped items by entrance/floor */
  groups?: PropertyGroup[];
  /** Currently selected property ID */
  value: string;
  /** Callback when a property is selected */
  onValueChange: (id: string) => void;
  /** Number of items per row (default: 5) */
  itemsPerRow?: 4 | 5;
  /** Placeholder text when no value is selected */
  placeholder?: string;
  /** Optional CSS class for the trigger button */
  className?: string;
  /** Full address label for selected item (e.g., "Ларина 45/1, Подъезд 2, Этаж 3, квартира №15") */
  selectedLabel?: string;
}

/**
 * Compact combobox selector for apartment/parking numbers
 * Displays as a dropdown button that opens a grid popover (4-5 per row)
 * Used in claim forms and property selection
 */
export function PropertyNumberGrid({
  items,
  groups,
  value,
  onValueChange,
  itemsPerRow = 5,
  placeholder = "Выберите",
  className,
  selectedLabel,
}: PropertyNumberGridProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const gridCols = itemsPerRow === 4 ? "grid-cols-4" : "grid-cols-5";

  // Flatten all items from groups or use items directly
  const allItems = useMemo(() => {
    if (groups) {
      return groups.flatMap((group) => group.items);
    }
    return items ?? [];
  }, [groups, items]);

  const selectedItem = allItems.find((item) => item.id === value);

  // Filter groups/items based on search query
  const filteredData = useMemo(() => {
    if (!search) {
      return groups ? groups : [{ label: "", items: items ?? [] }];
    }

    if (groups) {
      return groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => item.number.includes(search)),
        }))
        .filter((group) => group.items.length > 0);
    }

    return [
      {
        label: "",
        items: (items ?? []).filter((item) => item.number.includes(search)),
      },
    ];
  }, [groups, items, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedItem ? (
            <span className="flex items-center gap-2">
              <Check className="text-primary h-4 w-4 shrink-0" />
              <span className="truncate">{selectedLabel ?? selectedItem.number}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="sm:w-(--radix-popover-trigger-width) flex max-h-[calc(100vh-8rem)] w-[calc(100vw-2rem)] flex-col p-0"
        align="start"
        sideOffset={4}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="shrink-0 border-b p-2 sm:p-3">
          <div className="relative">
            <Search className="text-muted-foreground absolute left-2 top-2 h-4 w-4 sm:left-2.5 sm:top-2.5" />
            <Input
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-7 text-sm sm:h-9 sm:pl-8"
            />
          </div>
        </div>

        {/* Grid with optional grouping */}
        <div className="min-h-0 flex-1 overflow-y-auto p-2 sm:p-3">
          {filteredData.length === 0 || filteredData.every((g) => g.items.length === 0) ? (
            <div className="text-muted-foreground py-6 text-center text-sm">Ничего не найдено</div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredData.map((group, groupIdx) => (
                <div key={groupIdx}>
                  {group.label && (
                    <div className="text-muted-foreground mb-1.5 text-[10px] font-semibold uppercase leading-tight tracking-wide sm:mb-2 sm:text-xs">
                      {group.label}
                    </div>
                  )}
                  <div className={cn("grid gap-1.5", gridCols)}>
                    {group.items.map((item) => {
                      const isSelected = value === item.id;
                      const isDisabled = item.disabled ?? false;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            if (!isDisabled) {
                              onValueChange(item.id);
                              setSearch("");
                              setOpen(false);
                            }
                          }}
                          disabled={isDisabled}
                          title={isDisabled ? item.disabledLabel : `Выбрать ${item.number}`}
                          className={cn(
                            "relative h-9 rounded text-sm font-medium transition-colors sm:h-10",
                            "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2",
                            isSelected && "bg-primary text-primary-foreground",
                            !isSelected && !isDisabled && "bg-muted hover:bg-muted/80",
                            isDisabled && "cursor-not-allowed opacity-40"
                          )}
                        >
                          <span className="block">{item.number}</span>
                          {isDisabled && item.disabledLabel && (
                            <span className="text-muted-foreground absolute inset-x-0 top-full mt-0.5 truncate px-0.5 text-[8px]">
                              {item.disabledLabel}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
