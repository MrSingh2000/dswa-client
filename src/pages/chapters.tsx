import { useState, useMemo, memo } from "react";
import {
  ChevronDown,
  ChevronRight,
  Search,
  Code2,
  ExternalLink,
  SquarePlay,
  BookOpen,
  FolderTree,
  ChevronsUpDown,
} from "lucide-react";
import { useGetDsaHierarchy } from "@/query/dsa/dsa-chapters.query";
import { useToggleProblemStatus } from "@/query/dsa/dsa-problems.query";
import { toaster } from "@/utils/toaster";
import type {
  ITopicHierarchy,
  IChapter,
  IChapterProblem,
} from "@/api/request/chapters.request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loader from "@/components/loader";
import { cn } from "cn";

// Sub-component for rendering difficulty badges with design system colors
const ProblemDifficultyBadge = memo(({ difficulty }: { difficulty?: string }) => {
  const formatted = difficulty?.toLowerCase() || "easy";
  if (formatted === "easy") {
    return <Badge variant="success">Easy</Badge>;
  }
  if (formatted === "medium") {
    return <Badge variant="warning">Medium</Badge>;
  }
  return <Badge variant="destructive">Hard</Badge>;
});

ProblemDifficultyBadge.displayName = "ProblemDifficultyBadge";

// Sub-component for problem action links
const ProblemActionLinks = memo(({ problem }: { problem: IChapterProblem }) => (
  <div className="flex items-center justify-end gap-1.5">
    {problem.leetcodeUrl && (
      <Button
        variant="outline"
        size="icon-xs"
        className="text-amber-500 hover:text-amber-600"
        render={
          <a
            href={problem.leetcodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Solve on LeetCode"
          />
        }
      >
        <Code2 />
      </Button>
    )}
    {problem.gfgUrl && (
      <Button
        variant="outline"
        size="icon-xs"
        className="text-emerald-500 hover:text-emerald-600"
        render={
          <a
            href={problem.gfgUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Solve on GeeksforGeeks"
          />
        }
      >
        <ExternalLink />
      </Button>
    )}
    {problem.youtubeUrl && (
      <Button
        variant="outline"
        size="icon-xs"
        className="text-rose-500 hover:text-rose-600"
        render={
          <a
            href={problem.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Watch Video Solution"
          />
        }
      >
        <SquarePlay />
      </Button>
    )}
    {problem.articleUrl && (
      <Button
        variant="outline"
        size="icon-xs"
        className="text-sky-500 hover:text-sky-600"
        render={
          <a
            href={problem.articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Read Editorial Article"
          />
        }
      >
        <BookOpen />
      </Button>
    )}
  </div>
));

ProblemActionLinks.displayName = "ProblemActionLinks";

// Chapter problems table component
const ChapterProblemsTable = memo(
  ({
    problems,
    onToggle,
  }: {
    problems: IChapterProblem[];
    onToggle: (problem: IChapterProblem) => void;
  }) => {
    if (problems.length === 0) {
      return (
        <div className="py-4 text-center text-xs text-muted-foreground">
          No problems currently in this chapter.
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-16 text-center text-[11px] uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider">
                Problem Title
              </TableHead>
              <TableHead className="w-28 text-[11px] uppercase tracking-wider">
                Difficulty
              </TableHead>
              <TableHead className="w-36 text-right text-[11px] uppercase tracking-wider">
                Resources
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {problems.map((problem) => (
              <TableRow
                key={problem._id}
                className={cn(
                  "hover:bg-muted/30 transition-colors",
                  problem.isCompleted && "bg-muted/15",
                )}
              >
                <TableCell className="text-center py-2.5">
                  <label className="inline-flex items-center justify-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={problem.isCompleted ?? false}
                      onChange={() => onToggle(problem)}
                      aria-label={`Mark ${problem.title} as completed`}
                      className="h-4 w-4 rounded-sm border-primary/50 text-primary accent-primary focus:ring-1 focus:ring-ring cursor-pointer transition-all"
                    />
                  </label>
                </TableCell>
                <TableCell
                  className={cn(
                    "font-medium text-foreground py-2.5",
                    problem.isCompleted &&
                      "line-through text-muted-foreground opacity-80",
                  )}
                >
                  {problem.title}
                </TableCell>
                <TableCell className="py-2.5">
                  <ProblemDifficultyBadge difficulty={problem.difficulty} />
                </TableCell>
                <TableCell className="text-right py-2.5">
                  <ProblemActionLinks problem={problem} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  },
);

ChapterProblemsTable.displayName = "ChapterProblemsTable";

const Chapters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState<string | undefined>(undefined);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  const { data: hierarchyData, isLoading, isFetching } = useGetDsaHierarchy();
  const { mutate: toggleStatus } = useToggleProblemStatus();
  const topicsList = hierarchyData?.topics || [];

  const handleToggleProblem = (problem: IChapterProblem) => {
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
  };

  const toggleTopic = (id: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleChapter = (id: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const nextTopics: Record<string, boolean> = {};
    const nextChapters: Record<string, boolean> = {};

    topicsList.forEach((t) => {
      nextTopics[t._id] = true;
      (t.chapters || []).forEach((c) => {
        nextChapters[c._id] = true;
      });
    });

    setExpandedTopics(nextTopics);
    setExpandedChapters(nextChapters);
  };

  const collapseAll = () => {
    setExpandedTopics({});
    setExpandedChapters({});
  };

  // Filter topics -> chapters -> problems
  const filteredTopics = useMemo(() => {
    let result = topicsList;

    if (selectedTopicId) {
      result = result.filter((t) => t._id === selectedTopicId);
    }

    if (!searchQuery.trim()) return result;
    const q = searchQuery.toLowerCase();

    return result
      .map((topic) => {
        const topicMatches =
          topic.title.toLowerCase().includes(q) ||
          topic.description?.toLowerCase().includes(q);

        if (topicMatches) return topic;

        const matchingChapters = (topic.chapters || [])
          .map((ch) => {
            const chapterMatches =
              ch.title.toLowerCase().includes(q) ||
              ch.description?.toLowerCase().includes(q);

            if (chapterMatches) return ch;

            const matchingProblems = (ch.problems || []).filter(
              (p) =>
                p.title.toLowerCase().includes(q) ||
                p.difficulty?.toLowerCase().includes(q),
            );

            if (matchingProblems.length > 0) {
              return {
                ...ch,
                problems: matchingProblems,
              };
            }

            return null;
          })
          .filter((ch): ch is IChapter => ch !== null);

        if (matchingChapters.length > 0) {
          return {
            ...topic,
            chapters: matchingChapters,
          };
        }

        return null;
      })
      .filter((t): t is ITopicHierarchy => t !== null);
  }, [topicsList, selectedTopicId, searchQuery]);

  return (
    <div className="flex flex-1 flex-col h-full min-h-0 gap-5 p-2 overflow-hidden bg-background">
      {/* Header & Controls Toolbar */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Topic & Chapter Breakdown
          </h1>
          <p className="text-sm text-muted-foreground">
            Structured roadmap: Topics &gt; Chapters &gt; Problem Sheets.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {topicsList.length > 0 && (
            <select
              value={selectedTopicId || ""}
              onChange={(e) => setSelectedTopicId(e.target.value || undefined)}
              className="h-9 rounded-lg border border-input bg-background px-3 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            >
              <option value="">All Topics ({topicsList.length})</option>
              {topicsList.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title}
                </option>
              ))}
            </select>
          )}

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search topic, chapter, problem..."
              className="pl-9 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={expandAll}
            className="h-9 gap-1.5 text-xs cursor-pointer"
          >
            <ChevronsUpDown className="h-3.5 w-3.5" />
            Expand All
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={collapseAll}
            className="h-9 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Collapse All
          </Button>

          {(selectedTopicId || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedTopicId(undefined);
                setSearchQuery("");
              }}
              className="h-9 text-xs text-destructive hover:text-destructive cursor-pointer"
            >
              Reset
            </Button>
          )}

          {isFetching && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader size={14} className="h-auto w-auto" text="" />
            </div>
          )}
        </div>
      </div>

      {/* Main Hierarchical Content Container */}
      {isLoading ? (
        <div className="flex h-72 items-center justify-center">
          <Loader size={32} text="Loading topics syllabus..." className="h-auto w-auto" />
        </div>
      ) : filteredTopics.length === 0 ? (
        <Card className="flex flex-col items-center justify-center border-dashed py-16 text-center">
          <FolderTree className="h-10 w-10 text-muted-foreground/60 mb-3" />
          <h3 className="text-base font-semibold text-foreground">No topics found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search query or topic filter.
          </p>
        </Card>
      ) : (
        <Card className="flex flex-1 min-h-0 flex-col overflow-hidden shadow-xs p-0 gap-0">
          <div className="flex-1 overflow-x-auto overflow-y-auto min-h-0 divide-y divide-border">
            {filteredTopics.map((topicItem: ITopicHierarchy, tIdx: number) => {
              const isTopicExpanded =
                expandedTopics[topicItem._id] ?? searchQuery.trim().length > 0;
              const chapterCount = topicItem.chapters?.length || 0;
              const totalProblemsInTopic = (topicItem.chapters || []).reduce(
                (sum, c) => sum + (c.problems?.length || 0),
                0,
              );

              return (
                <div key={topicItem._id} className="group/topic">
                  {/* TOP LEVEL: TOPIC ACCORDION HEADER */}
                  <button
                    type="button"
                    onClick={() => toggleTopic(topicItem._id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors cursor-pointer",
                      isTopicExpanded ? "bg-muted/50 hover:bg-muted/70" : "hover:bg-muted/30",
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-colors">
                        {isTopicExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-primary border-primary/30 font-mono">
                            Topic {topicItem.order ?? tIdx + 1}
                          </Badge>
                          <Badge variant="secondary">
                            {chapterCount} {chapterCount === 1 ? "chapter" : "chapters"}
                          </Badge>
                        </div>
                        <h2 className="text-base font-bold text-foreground truncate mt-1">
                          {topicItem.title}
                        </h2>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <Badge variant="outline" className="font-normal">
                        {totalProblemsInTopic} total problems
                      </Badge>
                    </div>
                  </button>

                  {/* LEVEL 2: CHAPTERS UNDER TOPIC */}
                  {isTopicExpanded && (
                    <div className="border-t border-border bg-background/50 divide-y divide-border/60">
                      {chapterCount === 0 ? (
                        <div className="py-6 text-center text-xs text-muted-foreground">
                          No chapters found in this topic.
                        </div>
                      ) : (
                        topicItem.chapters.map((chapterItem: IChapter, cIdx: number) => {
                          const isChapterExpanded =
                            expandedChapters[chapterItem._id] ?? searchQuery.trim().length > 0;
                          const problemCount = chapterItem.problems?.length || 0;

                          return (
                            <div key={chapterItem._id} className="pl-6 group/chapter">
                              {/* CHAPTER SUB-TRIGGER */}
                              <button
                                type="button"
                                onClick={() => toggleChapter(chapterItem._id)}
                                className={cn(
                                  "flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition-colors cursor-pointer",
                                  isChapterExpanded ? "bg-muted/30 hover:bg-muted/50" : "hover:bg-muted/20",
                                )}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors group-hover/chapter:border-primary/50 group-hover/chapter:text-primary">
                                    {isChapterExpanded ? (
                                      <ChevronDown className="h-3.5 w-3.5" />
                                    ) : (
                                      <ChevronRight className="h-3.5 w-3.5" />
                                    )}
                                  </div>

                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[11px] font-mono text-muted-foreground">
                                        Sub-topic {cIdx + 1}
                                      </span>
                                    </div>
                                    <h3 className="text-sm font-semibold text-foreground truncate mt-0.5">
                                      {chapterItem.title}
                                    </h3>
                                  </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-3">
                                  <Badge variant="secondary" className="font-normal text-[11px]">
                                    {problemCount} {problemCount === 1 ? "problem" : "problems"}
                                  </Badge>
                                </div>
                              </button>

                              {/* LEVEL 3: PROBLEMS TABLE */}
                              {isChapterExpanded && (
                                <div className="ml-9 mr-5 my-2">
                                  <ChapterProblemsTable
                                    problems={chapterItem.problems}
                                    onToggle={handleToggleProblem}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Chapters;
