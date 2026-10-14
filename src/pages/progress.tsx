import React, { useMemo } from "react";
import { useGetDsaHierarchy } from "@/query/dsa/dsa-chapters.query";
import { useToggleProblemStatus } from "@/query/dsa/dsa-problems.query";
import Loader from "@/components/loader";
import { toaster } from "@/utils/toaster";
import {
  extractAllProblems,
  computeProgressStats,
  computeTopicStats,
  computeRecentActivity,
  type FlatProblem,
} from "@/components/progress/progress-helpers";
import { ProgressStatsCards } from "@/components/progress/progress-stats-cards";
import { DifficultyChartCard } from "@/components/progress/difficulty-chart-card";
import { TopicProgressChartCard } from "@/components/progress/topic-progress-chart-card";
import { ActivityChartCard } from "@/components/progress/activity-chart-card";
import { ProblemsHistoryTable } from "@/components/progress/problems-history-table";

const Progress = () => {
  const {
    data: hierarchyData,
    isLoading,
    isError,
    refetch,
  } = useGetDsaHierarchy();
  const { mutate: toggleStatus } = useToggleProblemStatus();

  const topics = hierarchyData?.topics || [];

  // Extract flat problem list with topic & chapter names
  const allProblems = useMemo(() => extractAllProblems(topics), [topics]);

  // Compute stats and chart datasets
  const stats = useMemo(
    () => computeProgressStats(allProblems, topics),
    [allProblems, topics],
  );
  const topicStats = useMemo(() => computeTopicStats(topics), [topics]);
  const activityData = useMemo(
    () => computeRecentActivity(allProblems, 14),
    [allProblems],
  );

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Loader size={36} text="Compiling your progress analytics..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="text-sm font-medium text-destructive">
          Failed to load progress data.
        </p>
        <button
          onClick={() => refetch()}
          className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col h-full min-h-0 gap-5 p-2 overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Learning Progress
          </h1>
          <p className="text-sm text-muted-foreground">
            Track metrics, analyze difficulty breakdown, and review your
            completed problems.
          </p>
        </div>
      </div>

      {/* Main Content Area - Scrollable Container */}
      <div className="flex flex-1 flex-col min-h-0 gap-5 overflow-y-auto pr-1">
        {/* Metric Cards */}
        <ProgressStatsCards stats={stats} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <DifficultyChartCard stats={stats} />
          </div>
          <div className="lg:col-span-2">
            <TopicProgressChartCard topicStats={topicStats} />
          </div>
        </div>

        {/* Activity Timeline */}
        <div>
          <ActivityChartCard activity={activityData} />
        </div>

        {/* Solved Problems Records Table */}
        <div className="flex flex-col min-h-[420px]">
          <ProblemsHistoryTable
            problems={allProblems}
          />
        </div>
      </div>
    </div>
  );
};

export default Progress;
