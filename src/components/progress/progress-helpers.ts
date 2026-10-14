import type { ITopicHierarchy, IChapterProblem } from "@/api/request/chapters.request";

export interface FlatProblem extends IChapterProblem {
  topicTitle: string;
  topicIdStr: string;
  chapterTitle: string;
  chapterIdStr: string;
}

export interface ProgressSummaryStats {
  totalProblems: number;
  completedProblems: number;
  completionRate: number;
  easyTotal: number;
  easyCompleted: number;
  mediumTotal: number;
  mediumCompleted: number;
  hardTotal: number;
  hardCompleted: number;
  totalTopics: number;
  totalChapters: number;
}

export interface TopicProgressStat {
  id: string;
  title: string;
  total: number;
  completed: number;
  completionRate: number;
  easyCompleted: number;
  mediumCompleted: number;
  hardCompleted: number;
}

export interface ActivityDay {
  date: string;
  label: string;
  count: number;
}

export const extractAllProblems = (topics: ITopicHierarchy[]): FlatProblem[] => {
  const problems: FlatProblem[] = [];

  topics.forEach((topic) => {
    (topic.chapters || []).forEach((chapter) => {
      (chapter.problems || []).forEach((p) => {
        problems.push({
          ...p,
          topicTitle: topic.title,
          topicIdStr: topic._id,
          chapterTitle: chapter.title,
          chapterIdStr: chapter._id,
        });
      });
    });
  });

  return problems;
};

export const computeProgressStats = (problems: FlatProblem[], topics: ITopicHierarchy[]): ProgressSummaryStats => {
  let easyTotal = 0;
  let easyCompleted = 0;
  let mediumTotal = 0;
  let mediumCompleted = 0;
  let hardTotal = 0;
  let hardCompleted = 0;
  let completedProblems = 0;

  problems.forEach((p) => {
    const diff = (p.difficulty || "").toLowerCase();
    const isDone = !!p.isCompleted;

    if (isDone) completedProblems++;

    if (diff === "easy") {
      easyTotal++;
      if (isDone) easyCompleted++;
    } else if (diff === "medium") {
      mediumTotal++;
      if (isDone) mediumCompleted++;
    } else if (diff === "hard") {
      hardTotal++;
      if (isDone) hardCompleted++;
    }
  });

  const totalProblems = problems.length;
  const completionRate = totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0;

  let totalChapters = 0;
  topics.forEach((t) => {
    totalChapters += (t.chapters || []).length;
  });

  return {
    totalProblems,
    completedProblems,
    completionRate,
    easyTotal,
    easyCompleted,
    mediumTotal,
    mediumCompleted,
    hardTotal,
    hardCompleted,
    totalTopics: topics.length,
    totalChapters,
  };
};

export const computeTopicStats = (topics: ITopicHierarchy[]): TopicProgressStat[] => {
  return topics.map((topic) => {
    let total = 0;
    let completed = 0;
    let easyCompleted = 0;
    let mediumCompleted = 0;
    let hardCompleted = 0;

    (topic.chapters || []).forEach((ch) => {
      (ch.problems || []).forEach((p) => {
        total++;
        if (p.isCompleted) {
          completed++;
          const diff = (p.difficulty || "").toLowerCase();
          if (diff === "easy") easyCompleted++;
          else if (diff === "medium") mediumCompleted++;
          else if (diff === "hard") hardCompleted++;
        }
      });
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      id: topic._id,
      title: topic.title,
      total,
      completed,
      completionRate,
      easyCompleted,
      mediumCompleted,
      hardCompleted,
    };
  });
};

export const computeRecentActivity = (problems: FlatProblem[], daysCount = 14): ActivityDay[] => {
  const result: ActivityDay[] = [];
  const today = new Date();

  // Create date keys for past N days (YYYY-MM-DD)
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    result.push({ date: dateStr, label, count: 0 });
  }

  const map = new Map<string, number>();
  problems.forEach((p) => {
    if (p.isCompleted && p.completedAt) {
      const dateKey = p.completedAt.split("T")[0];
      map.set(dateKey, (map.get(dateKey) || 0) + 1);
    }
  });

  result.forEach((item) => {
    item.count = map.get(item.date) || 0;
  });

  return result;
};
