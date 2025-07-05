'use client';

import React, { useMemo } from 'react';
import { Pie, PieChart, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { categories } from '@/lib/data';
import type { Expense } from '@/lib/types';

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
      <div className="w-full h-[300px] flex items-center justify-center text-muted-foreground">
        No spending data available.
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={60} paddingAngle={2}>
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend
              content={({ payload }) => (
                <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-4">
                  {payload?.map((entry: any) => (
                    <div key={`legend-${entry.value}`} className="flex items-center gap-2 text-sm">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
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
