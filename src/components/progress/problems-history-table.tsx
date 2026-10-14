import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Search,
  ExternalLink,
  SquarePlay,
  BookOpen,
  Code2,
  Filter,
} from "lucide-react";
import { cn } from "cn";
import type { FlatProblem } from "./progress-helpers";

interface ProblemsHistoryTableProps {
  problems: FlatProblem[];
}

export const ProblemsHistoryTable: React.FC<ProblemsHistoryTableProps> = ({
  problems,
}) => {
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "uncompleted"
  >("completed");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      // Status filter
      if (statusFilter === "completed" && !p.isCompleted) return false;
      if (statusFilter === "uncompleted" && p.isCompleted) return false;

      // Difficulty filter
      if (
        difficultyFilter !== "all" &&
        p.difficulty?.toLowerCase() !== difficultyFilter.toLowerCase()
      ) {
        return false;
      }

      // Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesTitle = p.title?.toLowerCase().includes(query);
        const matchesTopic = p.topicTitle?.toLowerCase().includes(query);
        const matchesChapter = p.chapterTitle?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesTopic && !matchesChapter) return false;
      }

      return true;
    });
  }, [problems, statusFilter, difficultyFilter, search]);

  const completedCount = useMemo(
    () => problems.filter((p) => p.isCompleted).length,
    [problems],
  );

  return (
    <Card className="flex flex-col flex-1 min-h-0 border-border/80 bg-card/60 backdrop-blur-xs shadow-xs overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/60">
        <div>
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <span>Problem Records & Log</span>
            <Badge variant="secondary" className="text-xs">
              {filteredProblems.length} results
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Explore solved problems, toggle statuses, and jump straight into
            problem resources
          </CardDescription>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center rounded-lg bg-muted/60 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("completed")}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer",
                statusFilter === "completed"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Completed ({completedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("uncompleted")}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer",
                statusFilter === "uncompleted"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Unsolved
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer",
                statusFilter === "all"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              All
            </button>
          </div>

          {/* Difficulty Dropdown */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="h-8 rounded-lg border border-input bg-background px-2 text-xs text-foreground outline-none cursor-pointer"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Quick Search */}
          <div className="relative w-44">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-y-auto min-h-0">
        {filteredProblems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <Filter className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm font-medium">
              No problems match your current criteria
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Try switching tabs or clearing your search filter
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="sticky top-0 bg-muted/60 backdrop-blur-xs z-10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[11px] uppercase tracking-wider">
                  Problem
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider">
                  Topic / Chapter
                </TableHead>
                <TableHead className="w-24 text-[11px] uppercase tracking-wider">
                  Difficulty
                </TableHead>
                <TableHead className="w-32 text-right text-[11px] uppercase tracking-wider">
                  Resources
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProblems.map((p) => {
                const diffLower = p.difficulty?.toLowerCase();
                return (
                  <TableRow
                    key={p._id}
                    className={cn(
                      "hover:bg-muted/30 transition-colors",
                      p.isCompleted && "bg-muted/10",
                    )}
                  >
                    <TableCell
                      className={cn(
                        "font-medium text-foreground py-2.5",
                        p.isCompleted &&
                          "line-through text-muted-foreground opacity-80",
                      )}
                    >
                      {p.title}
                    </TableCell>
                    <TableCell className="py-2.5">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-foreground">
                          {p.topicTitle}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {p.chapterTitle}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      {diffLower === "easy" && (
                        <Badge
                          variant="success"
                          className="text-[10px] font-semibold"
                        >
                          Easy
                        </Badge>
                      )}
                      {diffLower === "medium" && (
                        <Badge
                          variant="warning"
                          className="text-[10px] font-semibold"
                        >
                          Medium
                        </Badge>
                      )}
                      {diffLower === "hard" && (
                        <Badge
                          variant="destructive"
                          className="text-[10px] font-semibold"
                        >
                          Hard
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right py-2.5">
                      <div className="inline-flex items-center justify-end gap-1">
                        {p.leetcodeUrl && (
                          <a
                            href={p.leetcodeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="LeetCode Problem"
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-muted/20 text-muted-foreground hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/30 transition-colors"
                          >
                            <Code2 className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {p.youtubeUrl && (
                          <a
                            href={p.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Video Solution"
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-muted/20 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 transition-colors"
                          >
                            <SquarePlay className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {p.articleUrl && (
                          <a
                            href={p.articleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Editorial & Notes"
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-muted/20 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                          >
                            <BookOpen className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {p.gfgUrl && (
                          <a
                            href={p.gfgUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="GeeksforGeeks Article"
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-muted/20 text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30 transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
