import { api } from "../api";
import { endpoints } from "../endpoints";
import type { IProblem, ITopic } from "./problems.request";

export interface IChapterProblem extends Omit<IProblem, "topicId" | "chapterId"> {
  topicId?: string | ITopic;
  chapterId?: string;
}

export interface IChapter {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  order: number;
  topic?: ITopic & {
    description?: string;
  };
  topicId?: ITopic & {
    description?: string;
  };
  problems: IChapterProblem[];
}

export interface DsaChaptersResponse {
  chapters: IChapter[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ITopicHierarchy extends ITopic {
  description?: string;
  chapters: IChapter[];
}

export interface DsaSheetHierarchyResponse {
  topics: ITopicHierarchy[];
}

export const getDsaSheetHierarchyRequest = async () => {
  const response = await api.get<DsaSheetHierarchyResponse>(endpoints.dsaHierarchy);
  return response.data;
};
