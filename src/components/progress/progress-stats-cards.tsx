import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Target, Zap, Award, Layers, Flame } from "lucide-react";
import type { ProgressSummaryStats } from "./progress-helpers";

interface ProgressStatsCardsProps {
  stats: ProgressSummaryStats;
}

export const ProgressStatsCards: React.FC<ProgressStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Progress Card */}
      <Card className="relative overflow-hidden border-border/80 bg-gradient-to-br from-card to-card/60 shadow-xs">
        <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-primary/10 blur-xl pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Overall Completion
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Target className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {stats.completionRate}%
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              ({stats.completedProblems}/{stats.totalProblems})
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted/60">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground flex items-center gap-1">
            <Layers className="h-3 w-3" />
            Across {stats.totalTopics} Topics & {stats.totalChapters} Chapters
          </p>
        </CardContent>
      </Card>

      {/* Easy Problems Card */}
      <Card className="border-border/80 bg-gradient-to-br from-card to-card/60 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
            Easy Problems
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {stats.easyCompleted}
            </span>
            <span className="text-xs text-muted-foreground">/ {stats.easyTotal} solved</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted/60">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
              style={{
                width: `${stats.easyTotal > 0 ? (stats.easyCompleted / stats.easyTotal) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {stats.easyTotal > 0
              ? `${Math.round((stats.easyCompleted / stats.easyTotal) * 100)}% easy completion`
              : "No easy problems"}
          </p>
        </CardContent>
      </Card>

      {/* Medium Problems Card */}
      <Card className="border-border/80 bg-gradient-to-br from-card to-card/60 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-amber-500">
            Medium Problems
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
            <Zap className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {stats.mediumCompleted}
            </span>
            <span className="text-xs text-muted-foreground">/ {stats.mediumTotal} solved</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted/60">
            <div
              className="h-full bg-amber-500 transition-all duration-500 rounded-full"
              style={{
                width: `${stats.mediumTotal > 0 ? (stats.mediumCompleted / stats.mediumTotal) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {stats.mediumTotal > 0
              ? `${Math.round((stats.mediumCompleted / stats.mediumTotal) * 100)}% medium completion`
              : "No medium problems"}
          </p>
        </CardContent>
      </Card>

      {/* Hard Problems Card */}
      <Card className="border-border/80 bg-linear-to-br from-card to-card/60 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-rose-500">
            Hard Problems
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/15 text-rose-500">
            <Award className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {stats.hardCompleted}
            </span>
            <span className="text-xs text-muted-foreground">/ {stats.hardTotal} solved</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted/60">
            <div
              className="h-full bg-rose-500 transition-all duration-500 rounded-full"
              style={{
                width: `${stats.hardTotal > 0 ? (stats.hardCompleted / stats.hardTotal) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {stats.hardTotal > 0
              ? `${Math.round((stats.hardCompleted / stats.hardTotal) * 100)}% hard completion`
              : "No hard problems"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
