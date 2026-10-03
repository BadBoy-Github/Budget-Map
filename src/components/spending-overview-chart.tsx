'use client';

import React, { useMemo } from 'react';
import { Pie, PieChart, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { categories } from '@/lib/data';
import type { Expense } from '@/lib/types';

// Pencil outline keeps the donut looking drawn rather than rendered
const PENCIL = '#2d2d2d';

interface SpendingOverviewChartProps {
  expenses: Expense[];
}

export function SpendingOverviewChart({ expenses }: SpendingOverviewChartProps) {
  const chartData = useMemo(() => {
    const spendingByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return categories
      .map(category => ({
        name: category.name,
        value: spendingByCategory[category.name] || 0,
        fill: category.color,
      }))
      .filter(d => d.value > 0);
  }, [expenses]);

  const chartConfig = useMemo(() => {
    if (!chartData) return {};
    return chartData.reduce((acc, item) => {
      acc[item.name] = {
        label: item.name,
        color: item.fill,
      };
      return acc;
    }, {} as any);
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <div className="flex h-[240px] w-full flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-foreground/50 bg-postit/40 px-4 text-center sm:h-[280px]">
        <p className="font-headline text-xl font-bold">No spending data yet</p>
        <p className="text-base text-muted-foreground">
          Once you log an expense, this pie chart will sketch it out.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[240px] w-full sm:h-[280px] md:h-[300px]">
      <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="82%"
              innerRadius="52%"
              paddingAngle={2}
              stroke={PENCIL}
              strokeWidth={2.5}
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend
              content={({ payload }) => (
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                  {payload?.map((entry: any) => (
                    <div key={`legend-${entry.value}`} className="flex items-center gap-2 text-base">
                      <span
                        className="size-3 shrink-0 border-2 border-foreground"
                        style={{
                          backgroundColor: entry.color,
                          borderRadius: '40% 60% 55% 45% / 50% 45% 55% 50%',
                        }}
                      />
                      <span>{entry.value}</span>
                    </div>
                  ))}
                </div>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
