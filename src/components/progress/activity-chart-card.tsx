import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { ActivityDay } from "./progress-helpers";

interface ActivityChartCardProps {
  activity: ActivityDay[];
}

export const ActivityChartCard: React.FC<ActivityChartCardProps> = ({ activity }) => {
  const totalInPeriod = activity.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="flex flex-col border-border/80 bg-card/60 backdrop-blur-xs shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            Activity Timeline (Last 14 Days)
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Daily frequency of problems solved over the past 2 weeks
          </CardDescription>
        </div>
        <div className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500">
          {totalInPeriod} Solved Recently
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-1">
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activity}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.12} vertical={false} />
              <XAxis
                dataKey="label"
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
                    const data = payload[0].payload as ActivityDay;
                    return (
                      <div className="rounded-lg border border-border bg-popover px-3 py-1.5 shadow-md text-xs">
                        <p className="font-semibold text-popover-foreground">
                          {data.label}
                        </p>
                        <p className="text-muted-foreground">
                          {data.count} problem{data.count === 1 ? "" : "s"} completed
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#activityGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
