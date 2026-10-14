import {
  getDsaProblemsRequest,
  updateProblemStatusRequest,
  type ProblemDificulty,
  type DsaProblemsResponse,
} from "@/api/request/problems.request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import type { DsaSheetHierarchyResponse } from "@/api/request/chapters.request";
import { DateTime } from "luxon";

interface IUseGetDsaProblemsParams {
  page?: number;
  limit?: number;
  difficulty?: ProblemDificulty;
  topic?: string;
  chapter?: string;
}

export const useGetDsaProblems = ({
  page = 1,
  limit = 50,
  difficulty,
  topic,
  chapter,
}: IUseGetDsaProblemsParams) => {
  return useQuery({
    queryKey: [
      queryKeys.dsaProblems,
      { page, limit, difficulty, topic, chapter },
    ],
    queryFn: () =>
      getDsaProblemsRequest(page, limit, difficulty, topic, chapter),
  });
};

export const useToggleProblemStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      problemId,
      isCompleted,
      notes,
    }: {
      problemId: string;
      isCompleted?: boolean;
      notes?: string;
    }) => updateProblemStatusRequest(problemId, isCompleted, notes),

    onMutate: async ({ problemId, isCompleted: explicitIsCompleted }) => {
      await queryClient.cancelQueries({ queryKey: [queryKeys.dsaProblems] });
      await queryClient.cancelQueries({ queryKey: [queryKeys.dsaHierarchy] });

      const nowIso = DateTime.now().toISO();

      // Optimistically update all queries matching dsaProblems
      queryClient.setQueriesData<DsaProblemsResponse>(
        { queryKey: [queryKeys.dsaProblems] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            problems: oldData.problems.map((p) => {
              if (p._id === problemId) {
                const nextState =
                  typeof explicitIsCompleted === "boolean"
                    ? explicitIsCompleted
                    : !p.isCompleted;
                return {
                  ...p,
                  isCompleted: nextState,
                  completedAt: nextState ? nowIso : undefined,
                };
              }
              return p;
            }),
          };
        },
      );

      // Optimistically update hierarchy query
      queryClient.setQueriesData<DsaSheetHierarchyResponse>(
        { queryKey: [queryKeys.dsaHierarchy] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            topics: oldData.topics.map((t) => ({
              ...t,
              chapters: (t.chapters || []).map((c) => ({
                ...c,
                problems: (c.problems || []).map((p) => {
                  if (p._id === problemId) {
                    const nextState =
                      typeof explicitIsCompleted === "boolean"
                        ? explicitIsCompleted
                        : !p.isCompleted;
                    return {
                      ...p,
                      isCompleted: nextState,
                      completedAt: nextState ? nowIso : undefined,
                    };
                  }
                  return p;
                }),
              })),
            })),
          };
        },
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.dsaProblems] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.dsaHierarchy] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarMonth] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.calendarDay] });
    },
  });
};
