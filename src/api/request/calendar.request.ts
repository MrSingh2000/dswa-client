import { api } from "../api";
import { endpoints } from "../endpoints";
import type { IProblem } from "./problems.request";

export type CalendarEventType = "problem" | "revision" | "custom";

export interface ICalendarEvent {
  _id: string;
  userId: string;
  problemId?: IProblem;
  chapterId?: {
    _id: string;
    title: string;
    slug: string;
  };
  topicId?: {
    _id: string;
    title: string;
    slug: string;
  };
  scheduledDate: string; // "YYYY-MM-DD"
  eventType: CalendarEventType;
  title: string;
  notes?: string;
  isCompleted: boolean;
  completedAt?: string | null;
  planId?: string;
  orderOfDay: number;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarMonthResponse {
  year: number;
  month: number;
  eventsByDate: Record<string, ICalendarEvent[]>;
  solvedCountsByDate: Record<string, number>;
  totalEvents: number;
  completedEvents: number;
}

export interface CalendarDayResponse {
  date: string;
  events: ICalendarEvent[];
  totalEvents: number;
  completedEvents: number;
  solvedInSheetOnThisDay: Array<{
    _id: string;
    problemId: IProblem;
    isCompleted: boolean;
    completedAt: string;
  }>;
}

export interface CalendarPreviewProblem {
  id: string;
  title: string;
  difficulty: string;
  estimatedMinutes: number;
  topicTitle: string;
  chapterTitle: string;
}

export interface CalendarPreviewDay {
  date: string;
  totalMinutes: number;
  problemsCount: number;
  problems: CalendarPreviewProblem[];
}

export interface CalendarPreviewResponse {
  totalProblems: number;
  totalMinutes: number;
  totalHours: number;
  daysCount: number;
  dailyHours: number;
  startDate: string;
  endDate: string;
  dailyBreakdown: CalendarPreviewDay[];
  message?: string;
}

export interface GeneratePlanPayload {
  topicIds?: string[] | "all";
  startDate: string;
  dailyHours: number;
  includeSolved?: boolean;
  replaceExisting?: boolean;
}

export interface GeneratePlanResponse {
  message: string;
  planId: string;
  totalScheduled: number;
  startDate: string;
  endDate: string;
}

export interface QuickSchedulePayload {
  problemId: string;
  action: "tomorrow" | "revisit" | "custom_date";
  date?: string;
}

export interface AddEventPayload {
  scheduledDate: string;
  title: string;
  problemId?: string;
  eventType?: CalendarEventType;
  notes?: string;
}

export interface UpdateEventPayload {
  scheduledDate?: string;
  isCompleted?: boolean;
  notes?: string;
}

// API methods
export const getCalendarMonthRequest = async (year: number, month: number) => {
  const response = await api.get<CalendarMonthResponse>(endpoints.calendarMonth, {
    params: { year, month },
  });
  return response.data;
};

export const getCalendarDayRequest = async (date: string) => {
  const response = await api.get<CalendarDayResponse>(endpoints.calendarDay, {
    params: { date },
  });
  return response.data;
};

export const getCalendarPreviewRequest = async (payload: GeneratePlanPayload) => {
  const response = await api.post<CalendarPreviewResponse>(endpoints.calendarPreview, payload);
  return response.data;
};

export const generateCalendarPlanRequest = async (payload: GeneratePlanPayload) => {
  const response = await api.post<GeneratePlanResponse>(endpoints.calendarGenerate, payload);
  return response.data;
};

export const quickScheduleRequest = async (payload: QuickSchedulePayload) => {
  const response = await api.post(endpoints.calendarQuickSchedule, payload);
  return response.data;
};

export const addCalendarEventRequest = async (payload: AddEventPayload) => {
  const response = await api.post(endpoints.calendarEvents, payload);
  return response.data;
};

export const updateCalendarEventRequest = async (id: string, payload: UpdateEventPayload) => {
  const response = await api.patch(endpoints.calendarEventById(id), payload);
  return response.data;
};

export const deleteCalendarEventRequest = async (id: string) => {
  const response = await api.delete(endpoints.calendarEventById(id));
  return response.data;
};

export const clearCalendarPlanRequest = async (fromDate?: string) => {
  const response = await api.delete(endpoints.calendarClearPlan, {
    params: { fromDate },
  });
  return response.data;
};
