import React, { useState } from "react";
import { DateTime } from "luxon";
import {
  CalendarCheck2,
  CheckCircle2,
  Circle,
  Clock,
  Code2,
  ExternalLink,
  SquarePlay,
  BookOpen,
  Trash2,
  Flame,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Loader from "@/components/loader";
import { cn } from "cn";
import type { ICalendarEvent, CalendarDayResponse } from "@/api/request/calendar.request";

interface DayDetailsPanelProps {
  selectedDate: string; // YYYY-MM-DD
  dayData?: CalendarDayResponse;
  isLoading?: boolean;
  onToggleEvent: (event: ICalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
  onAddQuickTask: (title: string) => void;
}

export const DayDetailsPanel: React.FC<DayDetailsPanelProps> = ({
  selectedDate,
  dayData,
  isLoading,
  onToggleEvent,
  onDeleteEvent,
  onAddQuickTask,
}) => {
  const [quickTaskTitle, setQuickTaskTitle] = useState("");

  const formattedDate = (() => {
    const dt = DateTime.fromISO(selectedDate);
    return dt.isValid ? dt.toFormat("EEE, MMM d, yyyy") : selectedDate;
  })();

  const events = dayData?.events || [];
  const solvedInSheet = dayData?.solvedInSheetOnThisDay || [];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;
    onAddQuickTask(quickTaskTitle.trim());
    setQuickTaskTitle("");
  };

  return (
    <Card className="flex w-full lg:w-96 shrink-0 flex-col overflow-hidden border border-border bg-card shadow-xs py-0">
      <CardHeader className="border-b border-border bg-muted/20 pb-3 pt-4 px-4 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-primary">
            Day Schedule
          </span>
          <Badge variant="outline" className="text-[11px] font-normal">
            {events.length} planned
          </Badge>
        </div>
        <CardTitle className="text-lg font-bold tracking-tight text-foreground">
          {formattedDate}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col p-4 gap-4 overflow-y-auto min-h-0">
        {/* Quick add input */}
        <form onSubmit={handleAddSubmit} className="flex items-center gap-1.5">
          <Input
            placeholder="Add quick task or note..."
            value={quickTaskTitle}
            onChange={(e) => setQuickTaskTitle(e.target.value)}
            className="h-8 text-xs"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!quickTaskTitle.trim()}
            className="h-8 px-2.5 text-xs cursor-pointer shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </form>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center py-12">
            <Loader size={24} text="" />
          </div>
        ) : events.length === 0 && solvedInSheet.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <CalendarCheck2 className="h-10 w-10 text-muted-foreground/40 mb-2" />
            <p className="text-xs font-medium text-foreground">No tasks scheduled for this day</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Use the quick add above or generate a roadmap
            </p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-4">
            {/* Scheduled Tasks List */}
            {events.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Planned Problems ({events.filter((e) => e.isCompleted).length}/{events.length} done)
                </span>

                <div className="flex flex-col gap-2">
                  {events.map((ev) => {
                    const prob = ev.problemId;
                    return (
                      <div
                        key={ev._id}
                        className={cn(
                          "group relative flex flex-col gap-1.5 rounded-lg border border-border p-2.5 transition-all bg-card/60 hover:bg-muted/30",
                          ev.isCompleted && "bg-muted/20 border-emerald-500/20",
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <button
                            type="button"
                            onClick={() => onToggleEvent(ev)}
                            className="mt-0.5 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          >
                            {ev.isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <Circle className="h-4 w-4" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "text-xs font-semibold text-foreground truncate",
                                ev.isCompleted && "line-through text-muted-foreground opacity-80",
                              )}
                            >
                              {ev.title}
                            </p>

                            {/* Tags row */}
                            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
                              {prob?.difficulty && (
                                <span
                                  className={cn(
                                    "rounded px-1.5 py-0.2 font-medium",
                                    prob.difficulty.toLowerCase() === "easy" && "bg-emerald-500/15 text-emerald-500",
                                    prob.difficulty.toLowerCase() === "medium" && "bg-amber-500/15 text-amber-500",
                                    prob.difficulty.toLowerCase() === "hard" && "bg-rose-500/15 text-rose-500",
                                  )}
                                >
                                  {prob.difficulty}
                                </span>
                              )}

                              {ev.eventType === "revision" && (
                                <Badge variant="secondary" className="h-4 px-1 text-[9px]">
                                  Revision
                                </Badge>
                              )}

                              {prob?.estimatedMinutes && (
                                <span className="inline-flex items-center gap-0.5 text-muted-foreground font-mono">
                                  <Clock className="h-2.5 w-2.5" />
                                  {prob.estimatedMinutes}m
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Delete button */}
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => onDeleteEvent(ev._id)}
                            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive cursor-pointer transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Problem External Action Links */}
                        {prob && (
                          <div className="flex items-center justify-end gap-1 pt-1 border-t border-border/40">
                            {prob.leetcodeUrl && (
                              <a
                                href={prob.leetcodeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Solve on LeetCode"
                                className="inline-flex h-6 w-6 items-center justify-center rounded border border-border bg-background text-amber-500 hover:bg-muted transition-colors"
                              >
                                <Code2 className="h-3 w-3" />
                              </a>
                            )}
                            {prob.gfgUrl && (
                              <a
                                href={prob.gfgUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Solve on GFG"
                                className="inline-flex h-6 w-6 items-center justify-center rounded border border-border bg-background text-emerald-500 hover:bg-muted transition-colors"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            {prob.youtubeUrl && (
                              <a
                                href={prob.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Video Tutorial"
                                className="inline-flex h-6 w-6 items-center justify-center rounded border border-border bg-background text-rose-500 hover:bg-muted transition-colors"
                              >
                                <SquarePlay className="h-3 w-3" />
                              </a>
                            )}
                            {prob.articleUrl && (
                              <a
                                href={prob.articleUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Read Editorial"
                                className="inline-flex h-6 w-6 items-center justify-center rounded border border-border bg-background text-sky-500 hover:bg-muted transition-colors"
                              >
                                <BookOpen className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Problems Solved Outside / On Sheet on this date */}
            {solvedInSheet.length > 0 && (
              <div className="flex flex-col gap-2 pt-2 border-t border-border/80">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-500">
                  <Flame className="h-3.5 w-3.5 fill-amber-500" />
                  Solved in DSA Sheet on this day ({solvedInSheet.length})
                </span>

                <div className="flex flex-col gap-1.5">
                  {solvedInSheet.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between rounded-md bg-muted/30 px-2.5 py-1.5 text-xs text-foreground"
                    >
                      <span className="truncate font-medium">{item.problemId?.title || "Problem"}</span>
                      {item.problemId?.difficulty && (
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {item.problemId.difficulty}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
