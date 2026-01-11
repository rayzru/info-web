import { Clock } from "lucide-react";
import type { Schedule } from "./types";
import { SectionCard } from "./section-card";

type ScheduleSectionProps = {
  schedules: Schedule[];
};

const DAY_NAMES = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

export function ScheduleSection({ schedules }: ScheduleSectionProps) {
  if (schedules.length === 0) return null;

  return (
    <SectionCard icon={Clock} title="График работы">
      <div className="space-y-1 text-sm">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="flex justify-between gap-4">
            <span className="text-muted-foreground">
              {DAY_NAMES[schedule.dayOfWeek]}
            </span>
            <span>
              {schedule.openTime && schedule.closeTime
                ? `${schedule.openTime.slice(0, 5)} – ${schedule.closeTime.slice(0, 5)}`
                : schedule.note ?? "Выходной"}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
