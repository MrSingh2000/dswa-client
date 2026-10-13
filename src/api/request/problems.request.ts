import { api } from "../api";
import { endpoints } from "../endpoints";

export enum ProblemDificulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

export interface IChapter {
  _id: string;
  slug: string;
  order: number;
  title: string;
}

export interface ITopic {
  _id: string;
  slug: string;
  order: number;
  title: string;
}

export interface IProblem {
  _id: string;
  chapterId: IChapter;
  slug: string;
  articleUrl: string;
  createdAt: string;
  difficulty: string;
  gfgUrl: string;
  leetcodeUrl: string;
  order: number;
  title: string;
  topicId: ITopic;
  updatedAt: string;
  youtubeUrl: string;
}

export interface DsaProblemsResponse {
  problems: IProblem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getDsaProblemsRequest = async (
  page: number = 1,
  limit: number = 50, // default is set to 50 on backend
  difficulty?: ProblemDificulty,
  topic?: string, // topic id
  chapter?: string, // chapter id
) => {
  const response = await api.get<DsaProblemsResponse>(endpoints.dsaSheet, {
    params: {
      page,
      limit,
      difficulty,
      topic,
      chapter,
    },
  });
  return response.data;
};
