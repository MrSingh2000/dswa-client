export const endpoints = {
    login: "/auth/login",
    userDetails: "/users/me",
    dsaSheet: "/dsa/problems",
    dsaChapters: "/dsa/chapters",
    dsaHierarchy: "/dsa/sheet",
    updateProblemStatus: (problemId: string) => `/users/problems/${problemId}/status`,
}