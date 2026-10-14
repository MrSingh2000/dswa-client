import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { ProgressSummaryStats } from "./progress-helpers";

interface DifficultyChartCardProps {
  stats: ProgressSummaryStats;
}

const COLORS = {
  easy: "#10b981", // emerald-500
  medium: "#f59e0b", // amber-500
  hard: "#f43f5e", // rose-500
  unsolved: "#334155", // slate-700
};

export const DifficultyChartCard: React.FC<DifficultyChartCardProps> = ({ stats }) => {
  const unsolvedCount = Math.max(0, stats.totalProblems - stats.completedProblems);

  const data = [
    { name: "Easy Solved", value: stats.easyCompleted, color: COLORS.easy },
    { name: "Medium Solved", value: stats.mediumCompleted, color: COLORS.medium },
    { name: "Hard Solved", value: stats.hardCompleted, color: COLORS.hard },
    { name: "Remaining", value: unsolvedCount, color: COLORS.unsolved },
  ].filter((item) => item.value > 0);

  const chartData = data.length > 0 ? data : [{ name: "No data", value: 1, color: "#334155" }];

  return (
    <Card className="flex flex-col border-border/80 bg-card/60 backdrop-blur-xs shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Difficulty Breakdown
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Distribution of completed problems across difficulty tiers
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 items-center justify-between p-4">
        <div className="relative h-56 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={65}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0];
                    return (
                      <div className="rounded-lg border border-border bg-popover px-3 py-1.5 shadow-md text-xs">
                        <p className="font-semibold text-popover-foreground">
                          {item.name}
                        </p>
                        <p className="text-muted-foreground">
                          {item.value} problems
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered label inside donut */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {stats.completedProblems}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Solved
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-2 grid grid-cols-2 gap-3 w-full border-t border-border/60 pt-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-xs text-muted-foreground">Easy:</span>
            <span className="text-xs font-semibold text-foreground ml-auto">
              {stats.easyCompleted}/{stats.easyTotal}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="text-xs text-muted-foreground">Medium:</span>
            <span className="text-xs font-semibold text-foreground ml-auto">
              {stats.mediumCompleted}/{stats.mediumTotal}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0" />
            <span className="text-xs text-muted-foreground">Hard:</span>
            <span className="text-xs font-semibold text-foreground ml-auto">
              {stats.hardCompleted}/{stats.hardTotal}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-600 shrink-0" />
            <span className="text-xs text-muted-foreground">Remaining:</span>
            <span className="text-xs font-semibold text-foreground ml-auto">
              {unsolvedCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
