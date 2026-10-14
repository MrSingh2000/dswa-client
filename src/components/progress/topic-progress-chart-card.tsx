import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import type { TopicProgressStat } from "./progress-helpers";

interface TopicProgressChartCardProps {
  topicStats: TopicProgressStat[];
}

export const TopicProgressChartCard: React.FC<TopicProgressChartCardProps> = ({ topicStats }) => {
  const chartData = topicStats.map((t) => ({
    name: t.title.length > 12 ? `${t.title.slice(0, 10)}…` : t.title,
    fullName: t.title,
    easy: t.easyCompleted,
    medium: t.mediumCompleted,
    hard: t.hardCompleted,
    remaining: Math.max(0, t.total - t.completed),
    total: t.total,
    completed: t.completed,
    completionRate: t.completionRate,
  }));

  return (
    <Card className="flex flex-col border-border/80 bg-card/60 backdrop-blur-xs shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Topic Mastery
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Stacked breakdown of solved difficulties vs remaining per topic
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-1 flex-1">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.12} vertical={false} />
              <XAxis
                dataKey="name"
                angle={-30}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-muted-foreground"
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-border bg-popover p-2.5 shadow-md text-xs space-y-1.5 min-w-[160px]">
                        <p className="font-semibold text-popover-foreground">
                          {data.fullName}
                        </p>
                        <div className="text-muted-foreground flex justify-between">
                          <span>Total Solved:</span>
                          <span className="font-medium text-foreground">
                            {data.completed} / {data.total} ({data.completionRate}%)
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 pt-1 border-t border-border/60 text-[11px]">
                          <span className="text-emerald-500">E: {data.easy}</span>
                          <span className="text-amber-500">M: {data.medium}</span>
                          <span className="text-rose-500">H: {data.hard}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: "10px", fontSize: "11px" }}
              />
              <Bar dataKey="easy" name="Easy" fill="#10b981" stackId="stack" />
              <Bar dataKey="medium" name="Medium" fill="#f59e0b" stackId="stack" />
              <Bar dataKey="hard" name="Hard" fill="#f43f5e" stackId="stack" />
              <Bar dataKey="remaining" name="Remaining" fill="#334155" opacity={0.35} stackId="stack" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
