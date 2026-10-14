import {
  getDsaProblemsRequest,
  updateProblemStatusRequest,
  type ProblemDificulty,
} from "@/api/request/problems.request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import { toaster } from "@/utils/toaster";

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
    queryKey: [queryKeys.dsaProblems, { page, limit, difficulty, topic, chapter }],
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

    onMutate: async ({ problemId, isCompleted }) => {
      // Cancel outgoing queries so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: [queryKeys.dsaProblems] });
      await queryClient.cancelQueries({ queryKey: [queryKeys.dsaHierarchy] });

      // Snapshot previous values for rollback
      const previousProblemsQueries = queryClient.getQueriesData({
        queryKey: [queryKeys.dsaProblems],
      });
      const previousHierarchyQueries = queryClient.getQueriesData({
        queryKey: [queryKeys.dsaHierarchy],
      });

      // 1. Optimistically update all matching `dsaProblems` cache entries
      queryClient.setQueriesData<any>(
        { queryKey: [queryKeys.dsaProblems] },
        (oldData) => {
          if (!oldData?.problems) return oldData;
          return {
            ...oldData,
            problems: oldData.problems.map((problem: any) => {
              if (problem._id === problemId) {
                const nextState =
                  typeof isCompleted === "boolean"
                    ? isCompleted
                    : !problem.isCompleted;
                return {
                  ...problem,
                  isCompleted: nextState,
                  completedAt: nextState ? new Date().toISOString() : null,
                };
              }
              return problem;
            }),
          };
        },
      );

      // 2. Optimistically update `dsaHierarchy` cache entries
      queryClient.setQueriesData<any>(
        { queryKey: [queryKeys.dsaHierarchy] },
        (oldData) => {
          if (!oldData?.topics) return oldData;
          return {
            ...oldData,
            topics: oldData.topics.map((topic: any) => ({
              ...topic,
              chapters: (topic.chapters || []).map((ch: any) => ({
                ...ch,
                problems: (ch.problems || []).map((p: any) => {
                  if (p._id === problemId) {
                    const nextState =
                      typeof isCompleted === "boolean"
                        ? isCompleted
                        : !p.isCompleted;
                    return {
                      ...p,
                      isCompleted: nextState,
                      completedAt: nextState ? new Date().toISOString() : null,
                    };
                  }
                  return p;
                }),
              })),
            })),
          };
        },
      );

      return { previousProblemsQueries, previousHierarchyQueries };
    },

    onError: (_err, _variables, context) => {
      // Rollback to snapshots on error
      if (context?.previousProblemsQueries) {
        context.previousProblemsQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousHierarchyQueries) {
        context.previousHierarchyQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toaster.error("Failed to update status. Changes reverted.");
    },

    onSettled: () => {
      // Silently sync in the background
      queryClient.invalidateQueries({
        queryKey: [queryKeys.dsaProblems],
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.dsaHierarchy],
        refetchType: "none",
      });
    },
  });
};
