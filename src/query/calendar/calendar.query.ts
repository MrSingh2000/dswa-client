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
  type ICalendarEvent,
  type CalendarDayResponse,
  type CalendarMonthResponse,
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
    onMutate: async (payload: AddEventPayload) => {
      await queryClient.cancelQueries({ queryKey: [queryKeys.calendarDay] });
      await queryClient.cancelQueries({ queryKey: [queryKeys.calendarMonth] });

      const previousDayQueries = queryClient.getQueriesData<CalendarDayResponse>({
        queryKey: [queryKeys.calendarDay],
      });
      const previousMonthQueries = queryClient.getQueriesData<CalendarMonthResponse>({
        queryKey: [queryKeys.calendarMonth],
      });

      const nowIso = new Date().toISOString();
      const optimisticEvent: ICalendarEvent = {
        _id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        userId: "",
        scheduledDate: payload.scheduledDate,
        eventType: payload.eventType || "custom",
        title: payload.title,
        notes: payload.notes,
        isCompleted: false,
        orderOfDay: 0,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      // Optimistically update calendarDay queries matching payload date
      queryClient.setQueriesData<CalendarDayResponse>(
        { queryKey: [queryKeys.calendarDay, payload.scheduledDate] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            events: [...oldData.events, optimisticEvent],
            totalEvents: (oldData.totalEvents ?? oldData.events.length) + 1,
          };
        },
      );

      // Optimistically update calendarMonth queries
      queryClient.setQueriesData<CalendarMonthResponse>(
        { queryKey: [queryKeys.calendarMonth] },
        (oldData) => {
          if (!oldData) return oldData;
          const currentEvents = oldData.eventsByDate?.[payload.scheduledDate] || [];
          return {
            ...oldData,
            eventsByDate: {
              ...oldData.eventsByDate,
              [payload.scheduledDate]: [...currentEvents, optimisticEvent],
            },
            totalEvents: (oldData.totalEvents ?? 0) + 1,
          };
        },
      );

      return { previousDayQueries, previousMonthQueries };
    },
    onError: (_err, _payload, context) => {
      context?.previousDayQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      context?.previousMonthQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
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
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: [queryKeys.calendarDay] });
      await queryClient.cancelQueries({ queryKey: [queryKeys.calendarMonth] });

      const previousDayQueries = queryClient.getQueriesData<CalendarDayResponse>({
        queryKey: [queryKeys.calendarDay],
      });
      const previousMonthQueries = queryClient.getQueriesData<CalendarMonthResponse>({
        queryKey: [queryKeys.calendarMonth],
      });

      // Optimistically remove from all calendarDay queries
      queryClient.setQueriesData<CalendarDayResponse>(
        { queryKey: [queryKeys.calendarDay] },
        (oldData) => {
          if (!oldData) return oldData;
          const filteredEvents = oldData.events.filter((e) => e._id !== id);
          if (filteredEvents.length === oldData.events.length) {
            return oldData;
          }
          const removedEvent = oldData.events.find((e) => e._id === id);
          return {
            ...oldData,
            events: filteredEvents,
            totalEvents: Math.max(0, (oldData.totalEvents ?? oldData.events.length) - 1),
            completedEvents:
              removedEvent?.isCompleted && oldData.completedEvents
                ? Math.max(0, oldData.completedEvents - 1)
                : oldData.completedEvents,
          };
        },
      );

      // Optimistically remove from all calendarMonth queries
      queryClient.setQueriesData<CalendarMonthResponse>(
        { queryKey: [queryKeys.calendarMonth] },
        (oldData:CalendarMonthResponse | undefined) => {
          if (!oldData) return oldData;
          let eventFound = false;
          let wasCompleted = false;
          const updatedEventsByDate: Record<string, ICalendarEvent[]> = {};

          for (const [date, events] of Object.entries(oldData.eventsByDate || {})) {
            const match = events?.find((e) => e._id === id);
            if (match) {
              eventFound = true;
              if (match.isCompleted) wasCompleted = true;
              updatedEventsByDate[date] = events.filter((e) => e._id !== id);
            } else {
              updatedEventsByDate[date] = events;
            }
          }

          if (!eventFound) return oldData;

          return {
            ...oldData,
            eventsByDate: updatedEventsByDate,
            totalEvents: Math.max(0, (oldData.totalEvents ?? 0) - 1),
            completedEvents:
              wasCompleted && oldData.completedEvents
                ? Math.max(0, oldData.completedEvents - 1)
                : oldData.completedEvents,
          };
        },
      );

      return { previousDayQueries, previousMonthQueries };
    },
    onError: (_err, _id, context) => {
      context?.previousDayQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      context?.previousMonthQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
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
