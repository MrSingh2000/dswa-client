import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import {
  getCalendarMonthRequest,
  getCalendarDayRequest,
  getCalendarPreviewRequest,
  generateCalendarPlanRequest,
  quickScheduleRequest,
  addCalendarEventRequest,
  updateCalendarEventRequest,
  deleteCalendarEventRequest,
  clearCalendarPlanRequest,
  type GeneratePlanPayload,
  type QuickSchedulePayload,
  type AddEventPayload,
  type UpdateEventPayload,
} from "@/api/request/calendar.request";

export const useGetCalendarMonth = (year: number, month: number) => {
  return useQuery({
    queryKey: [queryKeys.calendarMonth, year, month],
    queryFn: () => getCalendarMonthRequest(year, month),
  });
};

export const useGetCalendarDay = (date: string) => {
  return useQuery({
    queryKey: [queryKeys.calendarDay, date],
    queryFn: () => getCalendarDayRequest(date),
    enabled: !!date,
  });
};

export const useGetCalendarPreview = (payload: GeneratePlanPayload, enabled: boolean = false) => {
  return useQuery({
    queryKey: [queryKeys.calendarPreview, payload],
    queryFn: () => getCalendarPreviewRequest(payload),
    enabled,
  });
};

export const useGenerateCalendarPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: GeneratePlanPayload) => generateCalendarPlanRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarMonth] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarDay] });
    },
  });
};

export const useQuickSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: QuickSchedulePayload) => quickScheduleRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarMonth] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarDay] });
    },
  });
};

export const useAddCalendarEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddEventPayload) => addCalendarEventRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarMonth] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarDay] });
    },
  });
};

export const useUpdateCalendarEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEventPayload }) =>
      updateCalendarEventRequest(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarMonth] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarDay] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.dsaProblems] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.dsaHierarchy] });
    },
  });
};

export const useDeleteCalendarEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCalendarEventRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarMonth] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarDay] });
    },
  });
};

export const useClearCalendarPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fromDate?: string) => clearCalendarPlanRequest(fromDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarMonth] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarDay] });
    },
  });
};
