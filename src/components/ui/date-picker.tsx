"use client";

import * as React from "react";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { cn } from "~/lib/utils";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  fromDate?: Date;
  toDate?: Date;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Выберите дату",
  disabled = false,
  className,
  fromDate,
  toDate,
}: DatePickerProps) {
  const handleSetToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    onChange?.(today);
  };

  const handleClear = () => {
    onChange?.(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "d MMMM yyyy", { locale: ru }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={(date) => {
            if (fromDate && date < fromDate) return true;
            if (toDate && date > toDate) return true;
            return false;
          }}
          locale={ru}
        />
        <div className="flex gap-2 border-t p-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleSetToday}
          >
            Сегодня
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={handleClear}
            >
              Очистить
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  fromDate?: Date;
  toDate?: Date;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Выберите дату и время",
  disabled = false,
  className,
  fromDate,
  toDate,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [time, setTime] = React.useState<string>(value ? format(value, "HH:mm") : "");

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange?.(undefined);
      return;
    }

    // Preserve time if already set
    if (time) {
      const [hours, minutes] = time.split(":").map(Number);
      date.setHours(hours ?? 0, minutes ?? 0);
    }
    onChange?.(date);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);

    if (value && newTime) {
      const [hours, minutes] = newTime.split(":").map(Number);
      const newDate = new Date(value);
      newDate.setHours(hours ?? 0, minutes ?? 0);
      onChange?.(newDate);
    }
  };

  const handleSetToday = () => {
    const today = new Date();
    // Preserve current time or set to current time
    if (time) {
      const [hours, minutes] = time.split(":").map(Number);
      today.setHours(hours ?? 0, minutes ?? 0, 0, 0);
    } else {
      const now = new Date();
      today.setHours(now.getHours(), now.getMinutes(), 0, 0);
      setTime(format(today, "HH:mm"));
    }
    onChange?.(today);
  };

  const handleClear = () => {
    onChange?.(undefined);
    setTime("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "d MMMM yyyy, HH:mm", { locale: ru }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          disabled={(date) => {
            if (fromDate && date < fromDate) return true;
            if (toDate && date > toDate) return true;
            return false;
          }}
          locale={ru}
        />
        <div className="space-y-3 border-t p-3">
          <div>
            <label className="text-sm font-medium">Время</label>
            <input
              type="time"
              value={time}
              onChange={handleTimeChange}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mt-1 block w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleSetToday}
            >
              Сегодня
            </Button>
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={handleClear}
              >
                Очистить
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
