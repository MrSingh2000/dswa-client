import React from "react";
import { DateTime } from "luxon";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarHeaderProps {
  currentDate: DateTime;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onOpenPlanModal: () => void;
  onOpenAddModal: () => void;
  onClearPlan: () => void;
  isClearing?: boolean;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  onOpenPlanModal,
  onOpenAddModal,
  onClearPlan,
  isClearing,
}) => {
  const monthName = currentDate.toFormat("LLLL");
  const year = currentDate.year;

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-4">
      {/* Title & Navigation */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
          <CalendarIcon className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {monthName} {year}
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Plan, monitor, and master your DSA interview preparation roadmap
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Month Navigation */}
        <div className="flex items-center rounded-lg border border-border bg-card p-0.5 shadow-2xs">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onPrevMonth}
            title="Previous Month"
            className="cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={onToday}
            className="text-xs font-medium px-2.5 cursor-pointer"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onNextMonth}
            title="Next Month"
            className="cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Add Custom Task */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenAddModal}
          className="gap-1.5 text-xs h-8 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Task
        </Button>

        {/* AI / Auto Generator Trigger */}
        <Button
          variant="default"
          size="sm"
          onClick={onOpenPlanModal}
          className="gap-1.5 text-xs h-8 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary cursor-pointer shadow-xs"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Auto-Generate Plan
        </Button>

        {/* Clear Future Plan */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearPlan}
          disabled={isClearing}
          title="Clear future scheduled plan"
          className="text-xs h-8 text-muted-foreground hover:text-destructive cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
