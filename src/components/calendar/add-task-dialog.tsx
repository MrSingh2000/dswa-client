import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Plus } from "lucide-react";
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
import { FormError } from "@/components/ui/form-error";
import Loader from "@/components/loader";
import { useAddCalendarEvent } from "@/query/calendar/calendar.query";
import { toaster } from "@/utils/toaster";
import { addTaskSchema, type AddTaskFormValues } from "@/schemas/add-task.schema";

interface AddTaskDialogProps {
  isOpen: boolean;
  defaultDate: string;
  onClose: () => void;
}

export const AddTaskDialog: React.FC<AddTaskDialogProps> = ({
  isOpen,
  defaultDate,
  onClose,
}) => {
  const { mutateAsync: addEvent, isPending } = useAddCalendarEvent();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<AddTaskFormValues>({
    defaultValues: {
      scheduledDate: defaultDate,
      title: "",
      eventType: "problem",
      notes: "",
    },
  });

  // Keep form in sync when defaultDate updates or modal reopens
  useEffect(() => {
    if (isOpen) {
      reset({
        scheduledDate: defaultDate,
        title: "",
        eventType: "problem",
        notes: "",
      });
    }
  }, [isOpen, defaultDate, reset]);

  const onSubmit = async (values: AddTaskFormValues) => {
    const parseResult = addTaskSchema.safeParse(values);
    if (!parseResult.success) {
      parseResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof AddTaskFormValues;
        if (field) {
          setError(field, { message: issue.message });
        }
      });
      return;
    }

    try {
      await addEvent({
        scheduledDate: parseResult.data.scheduledDate,
        title: parseResult.data.title,
        eventType: parseResult.data.eventType,
        notes: parseResult.data.notes || "",
      });
      toaster.success("Task added to calendar!");
      onClose();
    } catch {
      toaster.error("Failed to add task. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md pb-0">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Plus className="h-4 w-4" />
            </div>
            <DialogTitle>Add Calendar Task</DialogTitle>
          </div>
          <DialogDescription>
            Schedule a problem, revision reminder, or custom study session for your roadmap.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Scheduled Date */}
          <div className="space-y-1.5">
            <Label htmlFor="task-date" className="text-xs font-semibold">
              Date
            </Label>
            <Input
              id="task-date"
              type="date"
              disabled={isPending}
              aria-invalid={!!errors.scheduledDate}
              className="h-9 text-xs"
              {...register("scheduledDate")}
            />
            <FormError error={errors.scheduledDate} />
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="task-title" className="text-xs font-semibold">
              Task Title
            </Label>
            <Input
              id="task-title"
              placeholder="e.g., Solve 2 Heap problems / Dynamic Programming Revision"
              disabled={isPending}
              aria-invalid={!!errors.title}
              className="h-9 text-xs"
              {...register("title")}
            />
            <FormError error={errors.title} />
          </div>

          {/* Event Type with Shadcn Select */}
          <div className="space-y-1.5">
            <Label htmlFor="task-type" className="text-xs font-semibold">
              Type
            </Label>
            <Controller
              name="eventType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <SelectTrigger id="task-type" className="w-full h-9 text-xs">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="problem">Problem Practice</SelectItem>
                    <SelectItem value="revision">Spaced Revision</SelectItem>
                    <SelectItem value="custom">Custom Task / Mock Interview</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FormError error={errors.eventType} />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="task-notes" className="text-xs font-semibold">
              Notes (Optional)
            </Label>
            <Input
              id="task-notes"
              placeholder="Add extra context, specific problem links, or reminders"
              disabled={isPending}
              aria-invalid={!!errors.notes}
              className="h-9 text-xs"
              {...register("notes")}
            />
            <FormError error={errors.notes} />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isPending}
              className="text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="text-xs cursor-pointer"
            >
              {isPending ? <Loader size={14} text="" /> : "Add to Calendar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
