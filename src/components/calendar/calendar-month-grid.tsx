import React from "react";
import { DateTime } from "luxon";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Flame } from "lucide-react";
import type { ICalendarEvent } from "@/api/request/calendar.request";

interface CalendarMonthGridProps {
  currentDate: DateTime;
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
  eventsByDate: Record<string, ICalendarEvent[]>;
  solvedCountsByDate: Record<string, number>;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const CalendarMonthGrid: React.FC<CalendarMonthGridProps> = ({
  currentDate,
  selectedDate,
  onSelectDate,
  eventsByDate,
  solvedCountsByDate,
}) => {
  const startOfMonth = currentDate.startOf("month");
  const daysInMonth = currentDate.daysInMonth ?? 30;

  // Luxon weekday: 1 = Mon, 7 = Sun. Convert to 0 = Sun, 1 = Mon ... 6 = Sat
  const firstDayIndex = startOfMonth.weekday % 7;

  // Previous month info
  const prevMonth = currentDate.minus({ months: 1 });
  const prevMonthDays = prevMonth.daysInMonth ?? 30;

  const todayStr = DateTime.now().toISODate() ?? "";

  // Construct grid cells: prev month padding + current month days + next month padding
  const cells = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    const dateStr = prevMonth.set({ day: dayNum }).toISODate() ?? "";
    cells.push({
      dateStr,
      dayNum,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = currentDate.set({ day: d }).toISODate() ?? "";
    cells.push({
      dateStr,
      dayNum: d,
      isCurrentMonth: true,
    });
  }

  // Next month leading days to complete grid
  const remainingCells = (cells.length > 35 ? 42 : 35) - cells.length;
  const nextMonth = currentDate.plus({ months: 1 });
  for (let d = 1; d <= remainingCells; d++) {
    const dateStr = nextMonth.set({ day: d }).toISODate() ?? "";
    cells.push({
      dateStr,
      dayNum: d,
      isCurrentMonth: false,
    });
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs min-h-[500px]">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-center text-xs font-semibold text-muted-foreground">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2.5">
            {day}
          </div>
        ))}
      </div>

      {/* Grid of days */}
      <div className="grid flex-1 grid-cols-7 divide-x divide-y divide-border/60">
        {cells.map(({ dateStr, dayNum, isCurrentMonth }) => {
          const isSelected = selectedDate === dateStr;
          const isToday = todayStr === dateStr;
          const dayEvents = eventsByDate[dateStr] || [];
          const solvedInSheetCount = solvedCountsByDate[dateStr] || 0;

          const totalPlanned = dayEvents.length;
          const completedPlanned = dayEvents.filter((e) => e.isCompleted).length;

          return (
            <div
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={cn(
                "group relative flex flex-col p-1.5 transition-colors cursor-pointer min-h-[85px] max-h-[140px] overflow-hidden",
                !isCurrentMonth && "bg-muted/15 opacity-40 hover:opacity-80",
                isCurrentMonth && "hover:bg-muted/30",
                isSelected && "ring-2 ring-primary ring-inset bg-primary/5",
              )}
            >
              {/* Day header row */}
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                    isToday
                      ? "bg-primary text-primary-foreground font-bold"
                      : isSelected
                      ? "text-primary font-bold"
                      : "text-foreground",
                  )}
                >
                  {dayNum}
                </span>

                {/* Activity flame / indicator if problems were solved on this date */}
                {solvedInSheetCount > 0 && (
                  <span
                    title={`${solvedInSheetCount} problems solved on this date`}
                    className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-500"
                  >
                    <Flame className="h-3 w-3 fill-amber-500 text-amber-500" />
                    {solvedInSheetCount}
                  </span>
                )}
              </div>

              {/* Event items preview list */}
              <div className="mt-1 flex flex-1 flex-col gap-1 overflow-hidden">
                {dayEvents.slice(0, 2).map((ev) => (
                  <div
                    key={ev._id}
                    title={ev.title}
                    className={cn(
                      "flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium truncate transition-colors",
                      ev.isCompleted
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 line-through opacity-75"
                        : ev.eventType === "revision"
                        ? "bg-purple-500/15 text-purple-600 dark:text-purple-400"
                        : "bg-muted text-foreground",
                    )}
                  >
                    {ev.isCompleted ? (
                      <CheckCircle2 className="h-2.5 w-2.5 shrink-0 text-emerald-500" />
                    ) : (
                      <Circle className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
                    )}
                    <span className="truncate">{ev.title}</span>
                  </div>
                ))}

                {/* More items badge */}
                {totalPlanned > 2 && (
                  <span className="text-[10px] font-medium text-muted-foreground px-1">
                    +{totalPlanned - 2} more
                  </span>
                )}
              </div>

              {/* Day completion progress footer */}
              {totalPlanned > 0 && (
                <div className="mt-auto pt-1 flex items-center justify-between text-[9px] text-muted-foreground">
                  <span>
                    {completedPlanned}/{totalPlanned} done
                  </span>
                  {completedPlanned === totalPlanned && totalPlanned > 0 && (
                    <Badge variant="success" className="h-3.5 px-1 text-[8px]">
                      100%
                    </Badge>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
