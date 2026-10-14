import { useState } from "react";
import { DateTime } from "luxon";
import Loader from "@/components/loader";
import { toaster } from "@/utils/toaster";
import {
  useGetCalendarMonth,
  useGetCalendarDay,
  useUpdateCalendarEvent,
  useDeleteCalendarEvent,
  useAddCalendarEvent,
  useClearCalendarPlan,
} from "@/query/calendar/calendar.query";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { CalendarMonthGrid } from "@/components/calendar/calendar-month-grid";
import { DayDetailsPanel } from "@/components/calendar/day-details-panel";
import { AutoPlanGeneratorDialog } from "@/components/calendar/auto-plan-generator-dialog";
import { AddTaskDialog } from "@/components/calendar/add-task-dialog";
import type { ICalendarEvent } from "@/api/request/calendar.request";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState<DateTime>(DateTime.now());

  const todayStr = DateTime.now().toISODate() ?? "";

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const year = currentDate.year;
  const month = currentDate.month; // 1-indexed

  // Queries
  const { data: monthData, isLoading: isMonthLoading } = useGetCalendarMonth(year, month);
  const { data: dayData, isLoading: isDayLoading } = useGetCalendarDay(selectedDate);

  // Mutations
  const { mutate: updateEvent } = useUpdateCalendarEvent();
  const { mutate: deleteEvent } = useDeleteCalendarEvent();
  const { mutate: addEvent } = useAddCalendarEvent();
  const { mutateAsync: clearPlan, isPending: isClearing } = useClearCalendarPlan();

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate((prev) => prev.minus({ months: 1 }));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => prev.plus({ months: 1 }));
  };

  const handleToday = () => {
    setCurrentDate(DateTime.now());
    setSelectedDate(todayStr);
  };

  // Event actions
  const handleToggleEvent = (event: ICalendarEvent) => {
    const nextCompleted = !event.isCompleted;
    updateEvent({
      id: event._id,
      payload: { isCompleted: nextCompleted },
    });
    if (nextCompleted) {
      toaster.success(`Marked "${event.title}" as completed`);
    } else {
      toaster.info(`Marked "${event.title}" as incomplete`);
    }
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    toaster.info("Event removed from calendar");
  };

  const handleAddQuickTask = (title: string) => {
    addEvent({
      scheduledDate: selectedDate,
      title,
      eventType: "custom",
    });
    toaster.success("Task added to today's schedule!");
  };

  const handleClearFuturePlan = async () => {
    if (!window.confirm("Are you sure you want to clear upcoming study plan tasks?")) {
      return;
    }
    try {
      const res = await clearPlan(selectedDate);
      toaster.success(res.message || "Future schedule cleared.");
    } catch {
      toaster.error("Failed to clear schedule.");
    }
  };

  return (
    <div className="flex flex-1 flex-col h-full min-h-0 gap-4 p-2 overflow-hidden bg-background">
      {/* Top Header & Toolbar */}
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onOpenPlanModal={() => setIsPlanModalOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onClearPlan={handleClearFuturePlan}
        isClearing={isClearing}
      />

      {/* Main Calendar Workspace (Month Grid + Day Panel) */}
      <div className="flex flex-1 flex-col lg:flex-row gap-4 min-h-0 overflow-hidden">
        {/* Monthly Grid View */}
        {isMonthLoading ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-border bg-card">
            <Loader size={32} text="Loading your study calendar..." />
          </div>
        ) : (
          <CalendarMonthGrid
            currentDate={currentDate}
            selectedDate={selectedDate}
            onSelectDate={(date) => setSelectedDate(date)}
            eventsByDate={monthData?.eventsByDate || {}}
            solvedCountsByDate={monthData?.solvedCountsByDate || {}}
          />
        )}

        {/* Selected Day Details Panel */}
        <DayDetailsPanel
          selectedDate={selectedDate}
          dayData={dayData}
          isLoading={isDayLoading}
          onToggleEvent={handleToggleEvent}
          onDeleteEvent={handleDeleteEvent}
          onAddQuickTask={handleAddQuickTask}
        />
      </div>

      {/* Auto-Plan Generator Modal */}
      <AutoPlanGeneratorDialog
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
      />

      {/* Manual Task Add Modal */}
      <AddTaskDialog
        isOpen={isAddModalOpen}
        defaultDate={selectedDate}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default Calendar;
