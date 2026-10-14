import React, { useEffect } from "react";
import { DateTime } from "luxon";
import { useForm, Controller } from "react-hook-form";
import {
  Sparkles,
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FormError } from "@/components/ui/form-error";
import Loader from "@/components/loader";
import {
  useGetCalendarPreviewQuery,
  useGenerateCalendarPlanMutation,
} from "@/query/calendar/calendar.query";
import { useGetDsaHierarchyQuery } from "@/query/dsa/dsa-chapters.query";
import { toaster } from "@/utils/toaster";
import { cn } from "cn";
import type { GeneratePlanPayload } from "@/api/request/calendar.request";
import {
  autoPlanSchema,
  type AutoPlanFormValues,
} from "@/schemas/auto-plan.schema";

interface AutoPlanGeneratorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_HOURS = [1, 1.5, 2, 2.5, 3, 4] as const;

export const AutoPlanGeneratorDialog: React.FC<
  AutoPlanGeneratorDialogProps
> = ({ isOpen, onClose }) => {
  const tomorrowStr = DateTime.now().plus({ days: 1 }).toISODate() ?? "";

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm<AutoPlanFormValues>({
    defaultValues: {
      selectedTopicId: "all",
      startDate: tomorrowStr,
      dailyHours: 2,
      includeSolved: false,
      replaceExisting: true,
    },
  });

  // Re-sync form default values when opening dialog
  useEffect(() => {
    if (isOpen) {
      reset({
        selectedTopicId: "all",
        startDate: tomorrowStr,
        dailyHours: 2,
        includeSolved: false,
        replaceExisting: true,
      });
    }
  }, [isOpen, tomorrowStr, reset]);

  // Watch form fields for live preview calculation
  const watchedValues = watch();

  // Topics for filter dropdown
  const { data: hierarchyData } = useGetDsaHierarchyQuery();
  const topics = hierarchyData?.topics || [];

  // Preview Query
  const previewPayload: GeneratePlanPayload = {
    topicIds:
      watchedValues.selectedTopicId === "all"
        ? "all"
        : [watchedValues.selectedTopicId],
    startDate: watchedValues.startDate || tomorrowStr,
    dailyHours: Number(watchedValues.dailyHours) || 2,
    includeSolved: watchedValues.includeSolved,
  };

  const {
    data: previewData,
    isLoading: isPreviewLoading,
    isFetching: isPreviewFetching,
  } = useGetCalendarPreviewQuery(previewPayload, isOpen);

  // Generate Mutation
  const { mutateAsync: generatePlan, isPending: isGenerating } =
    useGenerateCalendarPlanMutation();

  const onSubmit = async (values: AutoPlanFormValues) => {
    const parseResult = autoPlanSchema.safeParse(values);
    if (!parseResult.success) {
      parseResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof AutoPlanFormValues;
        if (field) {
          setError(field, { message: issue.message });
        }
      });
      return;
    }

    try {
      const res = await generatePlan({
        topicIds:
          parseResult.data.selectedTopicId === "all"
            ? "all"
            : [parseResult.data.selectedTopicId],
        startDate: parseResult.data.startDate,
        dailyHours: parseResult.data.dailyHours,
        includeSolved: parseResult.data.includeSolved,
        replaceExisting: parseResult.data.replaceExisting,
      });
      toaster.success(res.message || "Study plan generated successfully!");
      onClose();
    } catch {
      toaster.error("Failed to generate plan. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-auto max-w-2xl! max-h-[90vh] flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                Auto-Generate Study Plan
              </DialogTitle>
              <DialogDescription className="text-xs">
                Intelligently pace your preparation based on your daily capacity
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Form Content */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Topic Selection */}
            <div className="space-y-1.5">
              <Label
                htmlFor="plan-topic-scope"
                className="text-xs font-semibold"
              >
                Curriculum Scope
              </Label>
              <Controller
                name="selectedTopicId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isGenerating}
                  >
                    <SelectTrigger
                      id="plan-topic-scope"
                      className="w-full h-9 text-xs"
                    >
                      <SelectValue placeholder="Select curriculum scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        All Topics ({topics.length} topics)
                      </SelectItem>
                      {topics.map((t) => (
                        <SelectItem key={t._id} value={t._id}>
                          {t.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FormError error={errors.selectedTopicId} />
            </div>

            {/* Start Date */}
            <div className="space-y-1.5">
              <Label
                htmlFor="plan-start-date"
                className="text-xs font-semibold"
              >
                Start Date
              </Label>
              <Input
                id="plan-start-date"
                type="date"
                min={tomorrowStr}
                disabled={isGenerating}
                aria-invalid={!!errors.startDate}
                className="h-9 text-xs"
                {...register("startDate")}
              />
              <FormError error={errors.startDate} />
            </div>

            {/* Daily Hours Commitment */}
            <div className="space-y-1.5 sm:col-span-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="plan-daily-hours"
                  className="text-xs font-semibold"
                >
                  Daily Study Hours Commitment
                </Label>
                <span className="text-xs font-mono font-bold text-primary">
                  {watchedValues.dailyHours}{" "}
                  {watchedValues.dailyHours === 1 ? "hour" : "hours"} / day (
                  {Math.round(Number(watchedValues.dailyHours) * 60)} mins)
                </span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {PRESET_HOURS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    disabled={isGenerating}
                    onClick={() =>
                      setValue("dailyHours", h, { shouldValidate: true })
                    }
                    className={cn(
                      "flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors cursor-pointer",
                      watchedValues.dailyHours === h
                        ? "border-primary bg-primary text-primary-foreground font-bold shadow-xs"
                        : "border-border bg-muted/40 text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {h}h
                  </button>
                ))}
              </div>
              <FormError error={errors.dailyHours} />
            </div>

            {/* Checkboxes */}
            <div className="sm:col-span-2 flex flex-col gap-2 pt-1">
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isGenerating}
                  className="rounded border-border text-primary accent-primary"
                  {...register("includeSolved")}
                />
                Include already completed problems (Full Revision mode)
              </label>

              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  disabled={isGenerating}
                  className="rounded border-border text-primary accent-primary"
                  {...register("replaceExisting")}
                />
                Replace future incomplete schedule items starting from start
                date
              </label>
            </div>
          </div>

          {/* Interactive Estimation Summary Card */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Roadmap Projection
              </span>
              {isPreviewFetching && (
                <span className="text-[10px] text-muted-foreground animate-pulse">
                  Recalculating...
                </span>
              )}
            </div>

            {isPreviewLoading ? (
              <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border">
                <Loader size={20} text="Calculating timeline..." />
              </div>
            ) : previewData ? (
              <Card className="border border-border/80 bg-muted/30 shadow-none">
                <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <BookOpen className="h-3 w-3" /> Problems
                    </span>
                    <span className="text-lg font-bold text-foreground mt-0.5">
                      {previewData.totalProblems}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3" /> Total Hours
                    </span>
                    <span className="text-lg font-bold text-foreground mt-0.5">
                      {previewData.totalHours}h
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <CalendarIcon className="h-3 w-3" /> Duration
                    </span>
                    <span className="text-lg font-bold text-foreground mt-0.5">
                      {previewData.daysCount} days
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <CheckCircle className="h-3 w-3 text-emerald-500" />{" "}
                      Completion
                    </span>
                    <span className="text-xs font-bold text-emerald-500 mt-1 truncate">
                      {previewData.endDate}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Sample breakdown preview */}
          {previewData && previewData.dailyBreakdown.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Sample Schedule (First 3 Days)
              </span>

              <div className="space-y-2">
                {previewData.dailyBreakdown.slice(0, 3).map((day, idx) => (
                  <div
                    key={day.date}
                    className="flex items-center justify-between rounded-lg border border-border bg-background p-2.5 text-xs gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px]"
                      >
                        Day {idx + 1} ({day.date})
                      </Badge>
                      <span className="text-foreground font-medium truncate max-w-[280px]">
                        {day.problems.map((p) => p.title).join(", ")}
                      </span>
                    </div>

                    <span className="text-muted-foreground font-mono text-[10px]">
                      {day.totalMinutes}m planned
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dialog Footer Actions */}
          <DialogFooter className="border-t border-border bg-muted/20 -mx-6 -mb-6 px-6 py-3.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isGenerating}
              className="text-xs cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={
                isGenerating || !previewData || previewData.totalProblems === 0
              }
              className="gap-2 text-xs cursor-pointer shadow-xs"
            >
              {isGenerating ? (
                <Loader size={14} text="" />
              ) : (
                <>
                  <span>Generate Calendar Roadmap</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
