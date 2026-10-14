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

export const useGetCalendarMonthQuery = (year: number, month: number) => {
  return useQuery({
    queryKey: [queryKeys.calendarMonth, year, month],
    queryFn: () => getCalendarMonthRequest(year, month),
  });
};

export const useGetCalendarDayQuery = (date: string) => {
  return useQuery({
    queryKey: [queryKeys.calendarDay, date],
    queryFn: () => getCalendarDayRequest(date),
    enabled: !!date,
  });
};

export const useGetCalendarPreviewQuery = (
  payload: GeneratePlanPayload,
  enabled: boolean = false,
) => {
  return useQuery({
    queryKey: [queryKeys.calendarPreview, payload],
    queryFn: () => getCalendarPreviewRequest(payload),
    enabled,
  });
};

export const useGenerateCalendarPlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: GeneratePlanPayload) =>
      generateCalendarPlanRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarMonth] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarDay] });
    },
  });
};

export const useQuickScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: QuickSchedulePayload) =>
      quickScheduleRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarMonth] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarDay] });
    },
  });
};

export const useAddCalendarEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddEventPayload) => addCalendarEventRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarMonth] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarDay] });
    },
  });
};

export const useUpdateCalendarEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateEventPayload;
    }) => updateCalendarEventRequest(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarMonth] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarDay] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.dsaProblems] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.dsaHierarchy] });
    },
  });
};

export const useDeleteCalendarEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCalendarEventRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarMonth] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarDay] });
    },
  });
};

export const useClearCalendarPlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fromDate?: string) => clearCalendarPlanRequest(fromDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarMonth] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarDay] });
    },
  });
};
