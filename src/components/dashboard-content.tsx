'use client';

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ExpensesTable } from "@/components/expenses-table";
import { SpendingOverviewChart } from "@/components/spending-overview-chart";
import type { Expense } from "@/lib/types";
import { EditBudgetDialog } from './edit-budget-dialog';
import { cn } from '@/lib/utils';

interface DashboardContentProps {
  currentMonthExpenses: Expense[];
  previousMonthExpenses: Expense[];
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  budgetGoal: number | null;
  onUpdateBudget: (newGoal: number) => void;
}

export function DashboardContent({ 
  currentMonthExpenses, 
  previousMonthExpenses,
  onUpdateExpense, 
  onDeleteExpense,
  budgetGoal,
  onUpdateBudget
}: DashboardContentProps) {
  const isBudgetSet = budgetGoal !== null;

  const totalSpent = useMemo(() => currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0), [currentMonthExpenses]);
  const previousTotalSpent = useMemo(() => previousMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0), [previousMonthExpenses]);

  const budgetLeft = (budgetGoal ?? 0) - totalSpent;
  const budgetProgress = budgetGoal && budgetGoal > 0 ? (totalSpent / budgetGoal) * 100 : 0;

  const topCategory = useMemo(() => {
    if (currentMonthExpenses.length === 0) return 'N/A';
    
    const spendingByCategory = currentMonthExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const top = Object.entries(spendingByCategory).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : 'N/A';
  }, [currentMonthExpenses]);
  
  const savedRatio = useMemo(() => {
    const currentBudget = budgetGoal ?? 0;
    if (previousMonthExpenses.length === 0) {
      return "N/A";
    }

    const savedThisMonth = currentBudget - totalSpent;
    // Assuming previous month had the same budget goal for comparison. A more complex system might store historical goals.
    const savedLastMonth = currentBudget - previousTotalSpent;

    if (savedLastMonth === 0) {
      if (savedThisMonth > 0) return '∞%';
      if (savedThisMonth < 0) return '-∞%';
      return '0%';
    }

    const change = savedThisMonth - savedLastMonth;
    const ratio = (change / Math.abs(savedLastMonth)) * 100;
    
    if (isNaN(ratio) || !isFinite(ratio)) {
        return "N/A";
    }

    return `${ratio > 0 ? '+' : ''}${ratio.toFixed(0)}%`;
  }, [totalSpent, previousTotalSpent, budgetGoal, previousMonthExpenses]);

  return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
              <EditBudgetDialog 
                onUpdateBudget={onUpdateBudget} 
                currentBudget={budgetGoal ?? 0} 
                isBudgetSet={isBudgetSet} 
              />
            </CardHeader>
            <CardContent>
              {isBudgetSet ? (
                <>
                  <div className="text-2xl font-bold">₹{(budgetGoal ?? 0).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Your total budget for this month</p>
                  <Progress value={budgetProgress} className="mt-4" />
                  <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                    <span>Spent: ₹{totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span>Left: ₹{budgetLeft.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </>
              ) : (
                <div className="flex h-[116px] flex-col items-center justify-center text-center">
                  <p className="font-medium text-muted-foreground">Set a budget to get started.</p>
                  <p className="text-sm text-muted-foreground">Any expenses will be tracked against it.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className={cn("space-y-6", !isBudgetSet && "opacity-40 pointer-events-none")}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Top Spending Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{topCategory}</div>
                <p className="text-xs text-muted-foreground">Your highest expenditure this month.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Saved vs Last Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{savedRatio}</div>
                <p className="text-xs text-muted-foreground">
                  {previousMonthExpenses.length === 0 
                    ? 'No previous month record.' 
                    : 'Change in savings from previous month.'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className={cn(!isBudgetSet && "opacity-40 pointer-events-none")}>
          <CardHeader>
            <CardTitle>Spending Overview</CardTitle>
            <CardDescription>A look at your spending by category for the selected month.</CardDescription>
          </CardHeader>
          <CardContent>
            <SpendingOverviewChart expenses={currentMonthExpenses} />
          </CardContent>
        </Card>

        <Card className={cn(!isBudgetSet && "opacity-40 pointer-events-none")}>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
            <CardDescription>A list of all your recorded expenses for the selected month.</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpensesTable expenses={currentMonthExpenses} onUpdateExpense={onUpdateExpense} onDeleteExpense={onDeleteExpense} />
          </CardContent>
        </Card>
      </div>
  );
}
