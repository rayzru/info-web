"use client";

import { useState } from "react";

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
import { api } from "~/trpc/react";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface TagSelectorProps {
  value: string[];
  onChange: (tagIds: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TagSelector({
  value,
  onChange,
  placeholder = "Выберите теги...",
  disabled = false,
}: TagSelectorProps) {
  const [open, setOpen] = useState(false);

  const { data: tagsData, isLoading } = api.directory.getTags.useQuery({
    includeAll: true,
  });

  const tags: Tag[] = tagsData ?? [];

  const selectedTags = tags.filter((tag) => value.includes(tag.id));

  const handleSelect = (tagId: string) => {
    if (value.includes(tagId)) {
      onChange(value.filter((id) => id !== tagId));
    } else {
      onChange([...value, tagId]);
    }
  };

  const handleRemove = (tagId: string) => {
    onChange(value.filter((id) => id !== tagId));
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled || isLoading}
            className="w-full justify-between"
          >
            {selectedTags.length > 0 ? `Выбрано: ${selectedTags.length}` : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Поиск тегов..." />
            <CommandList>
              <CommandEmpty>Теги не найдены</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-y-auto">
                {tags.map((tag) => (
                  <CommandItem key={tag.id} value={tag.name} onSelect={() => handleSelect(tag.id)}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(tag.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {tag.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedTags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleRemove(tag.id)}
            >
              {tag.name}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
