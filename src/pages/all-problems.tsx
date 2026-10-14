import { useState, useMemo } from "react";
import {
  Search,
  ExternalLink,
  SquarePlay,
  BookOpen,
  Code2,
  ChevronLeft,
  ChevronRight,
  FilterX,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  ProblemDificulty,
  type IProblem,
} from "@/api/request/problems.request";
import {
  useGetDsaProblems,
  useToggleProblemStatus,
} from "@/query/dsa/dsa-problems.query";
import { cn } from "cn";
import Loader from "@/components/loader";
import { toaster } from "@/utils/toaster";

const AllProblems = () => {
  const [pageNum, setPageNum] = useState(1);
  const [limit] = useState(15);
  const [difficulty, setDifficulty] = useState<ProblemDificulty | undefined>(
    undefined,
  );
  const [topic, setTopic] = useState<string | undefined>(undefined);
  const [chapter, setChapter] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  const { mutate: toggleStatus, isPending: isUpdatingStatus } =
    useToggleProblemStatus();

  const {
    data: dsaProblems,
    isLoading,
    isFetching,
  } = useGetDsaProblems({
    page: pageNum,
    limit,
    difficulty,
    topic,
    chapter,
  });

  console.log("porblmes: ", dsaProblems)

  const problemsList = dsaProblems?.problems || [];

  // Extract distinct topics and chapters from currently loaded list for easy dynamic filtering
  const availableTopics = useMemo(() => {
    const map = new Map<string, string>();
    problemsList.forEach((p) => {
      if (p.topicId?._id && p.topicId?.title) {
        map.set(p.topicId._id, p.topicId.title);
      }
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [problemsList]);

  const availableChapters = useMemo(() => {
    const map = new Map<string, string>();
    problemsList.forEach((p) => {
      if (p.chapterId?._id && p.chapterId?.title) {
        map.set(p.chapterId._id, p.chapterId.title);
      }
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [problemsList]);

  // Client-side quick filter by problem title
  const filteredProblems = useMemo(() => {
    if (!searchQuery.trim()) return problemsList;
    const q = searchQuery.toLowerCase();
    return problemsList.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.topicId?.title?.toLowerCase().includes(q) ||
        p.chapterId?.title?.toLowerCase().includes(q),
    );
  }, [problemsList, searchQuery]);

  const clearFilters = () => {
    setDifficulty(undefined);
    setTopic(undefined);
    setChapter(undefined);
    setSearchQuery("");
    setPageNum(1);
  };

  const hasActiveFilters = Boolean(
    difficulty || topic || chapter || searchQuery,
  );

  const getDifficultyBadge = (level: string) => {
    const formatted = level.toLowerCase();
    if (formatted === "easy") {
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-500 dark:bg-emerald-500/20">
          Easy
        </span>
      );
    }
    if (formatted === "medium") {
      return (
        <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-500 dark:bg-amber-500/20">
          Medium
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-rose-500/15 px-2.5 py-0.5 text-xs font-semibold text-rose-500 dark:bg-rose-500/20">
        Hard
      </span>
    );
  };

  return (
    <div className="flex flex-1 flex-col h-full min-h-0 gap-5 p-2 overflow-hidden">
      {/* Page Header */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Problem Sheets
          </h1>
          <p className="text-sm text-muted-foreground">
            Practice curated Data Structures and Algorithms questions with
            detailed resources.
          </p>
        </div>

        {/* Quick Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search problem title..."
            className="pl-9 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Controls Bar */}
      <Card className="shrink-0 border border-border/80 bg-card/60 backdrop-blur-xs">
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mr-1">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters:</span>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1">
            <button
              type="button"
              onClick={() => {
                setDifficulty(undefined);
                setPageNum(1);
              }}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                !difficulty
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              All
            </button>
            {Object.values(ProblemDificulty).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => {
                  setDifficulty(diff);
                  setPageNum(1);
                }}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                  difficulty === diff
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Topic / Subject Filter */}
          {availableTopics.length > 0 && (
            <select
              value={topic || ""}
              onChange={(e) => {
                setTopic(e.target.value || undefined);
                setPageNum(1);
              }}
              className="h-8 rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              <option value="">All Topics</option>
              {availableTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          )}

          {/* Chapter Filter */}
          {availableChapters.length > 0 && (
            <select
              value={chapter || ""}
              onChange={(e) => {
                setChapter(e.target.value || undefined);
                setPageNum(1);
              }}
              className="h-8 rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              <option value="">All Chapters</option>
              {availableChapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          )}

          {/* Clear filters button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-destructive cursor-pointer"
            >
              <FilterX className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}

          {isFetching && (
            <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              <Loader size={14} className="h-auto w-auto" text="" />
              <span>Updating...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Problems Table / List */}
      {isLoading ? (
        <div className="flex h-72 items-center justify-center">
          <Loader
            size={32}
            text="Loading questions..."
            className="h-auto w-auto"
          />
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <Code2 className="h-10 w-10 text-muted-foreground/60 mb-3" />
          <h3 className="text-base font-semibold text-foreground">
            No problems found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting or clearing your filters to see more results.
          </p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="mt-4 cursor-pointer"
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-1 min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          <div className="flex-1 overflow-x-auto overflow-y-auto min-h-0">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-xs text-xs font-semibold text-muted-foreground shadow-xs">
                <tr>
                  <th className="w-16 px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5">Problem Title</th>
                  <th className="px-4 py-3.5">Topic</th>
                  <th className="px-4 py-3.5">Chapter</th>
                  <th className="px-4 py-3.5">Difficulty</th>
                  <th className="px-4 py-3.5 text-right">Links & Resources</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProblems.map((problem: IProblem) => (
                  <tr
                    key={problem._id}
                    className={cn(
                      "transition-colors hover:bg-muted/30",
                      problem.isCompleted && "bg-muted/15",
                    )}
                  >
                    <td className="px-4 py-3.5 text-center">
                      <label className="inline-flex items-center justify-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={problem.isCompleted ?? false}
                          onChange={() => {
                            const nextState = !problem.isCompleted;
                            toggleStatus({
                              problemId: problem._id,
                              isCompleted: nextState,
                            });
                            if (nextState) {
                              toaster.success(`Marked "${problem.title}" as completed`);
                            } else {
                              toaster.info(`Marked "${problem.title}" as incomplete`);
                            }
                          }}
                          aria-label={`Mark ${problem.title} as completed`}
                          className="h-4 w-4 rounded-sm border-primary/50 text-primary accent-primary focus:ring-1 focus:ring-ring cursor-pointer transition-all"
                        />
                      </label>
                    </td>
                    <td
                      className={cn(
                        "px-4 py-3.5 font-medium text-foreground",
                        problem.isCompleted && "line-through text-muted-foreground opacity-80",
                      )}
                    >
                      {problem.title}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-muted-foreground">
                      <span className="rounded-md bg-muted px-2 py-1 font-medium">
                        {problem.topicId?.title || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-muted-foreground">
                      {problem.chapterId?.title || "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      {getDifficultyBadge(problem.difficulty)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {problem.leetcodeUrl && (
                          <a
                            href={problem.leetcodeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Solve on LeetCode"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-amber-500 hover:bg-muted transition-colors"
                          >
                            <Code2 className="h-4 w-4" />
                          </a>
                        )}
                        {problem.gfgUrl && (
                          <a
                            href={problem.gfgUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Solve on GeeksforGeeks"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-emerald-500 hover:bg-muted transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        {problem.youtubeUrl && (
                          <a
                            href={problem.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Watch Video Solution"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-rose-500 hover:bg-muted transition-colors"
                          >
                            <SquarePlay className="h-4 w-4" />
                          </a>
                        )}
                        {problem.articleUrl && (
                          <a
                            href={problem.articleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Read Editorial Article"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-sky-500 hover:bg-muted transition-colors"
                          >
                            <BookOpen className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {dsaProblems && dsaProblems.totalPages > 1 && (
            <div className="flex shrink-0 items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground bg-card">
              <div>
                Showing{" "}
                <span className="font-medium text-foreground">
                  {(pageNum - 1) * limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-foreground">
                  {Math.min(pageNum * limit, dsaProblems.total)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {dsaProblems.total}
                </span>{" "}
                problems
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pageNum <= 1}
                  onClick={() => setPageNum((p) => Math.max(1, p - 1))}
                  className="h-8 w-8 p-0 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-2 font-medium text-foreground">
                  Page {dsaProblems.page} of {dsaProblems.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pageNum >= dsaProblems.totalPages}
                  onClick={() => setPageNum((p) => p + 1)}
                  className="h-8 w-8 p-0 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllProblems;
