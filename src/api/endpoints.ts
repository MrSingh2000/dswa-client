export const endpoints = {
  login: "/auth/login",
  userDetails: "/users/me",
  dsaSheet: "/dsa/problems",
  dsaChapters: "/dsa/chapters",
  dsaHierarchy: "/dsa/sheet",
  updateProblemStatus: (problemId: string) => `/users/problems/${problemId}/status`,

  // Calendar & Study Schedule Endpoints
  calendarMonth: "/calendar/month",
  calendarDay: "/calendar/day",
  calendarPreview: "/calendar/preview",
  calendarGenerate: "/calendar/generate",
  calendarQuickSchedule: "/calendar/quick-schedule",
  calendarEvents: "/calendar/events",
  calendarEventById: (id: string) => `/calendar/events/${id}`,
  calendarClearPlan: "/calendar/plan",
};
