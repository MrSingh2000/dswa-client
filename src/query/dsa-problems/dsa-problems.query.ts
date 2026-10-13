import {
  getDsaProblemsRequest,
  type ProblemDificulty,
} from "@/api/request/problems.request";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";

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
