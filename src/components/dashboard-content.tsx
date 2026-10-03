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

// Labels read like margin notes pinned above each figure
function StatLabel({ children }: { children: React.ReactNode }) {
  return (
    <CardTitle className="wavy-underline inline-block text-base font-bold sm:text-lg">
      {children}
    </CardTitle>
  );
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

  const locked = !isBudgetSet;

  return (
      <div className="space-y-6 md:space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* The headline number lives on a pinned post-it */}
          <Card decoration="tack" className="bg-postit text-postit-foreground hover:-rotate-1">
            <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
              <StatLabel>Monthly Budget</StatLabel>
              <EditBudgetDialog 
                onUpdateBudget={onUpdateBudget} 
                currentBudget={budgetGoal ?? 0} 
                isBudgetSet={isBudgetSet} 
              />
            </CardHeader>
            <CardContent>
              {isBudgetSet ? (
                <>
                  <div className="font-headline text-3xl font-bold leading-none sm:text-4xl">
                    ₹{(budgetGoal ?? 0).toLocaleString()}
                  </div>
                  <p className="mt-1 text-sm text-foreground/70 sm:text-base">
                    Your total budget for this month
                  </p>
                  <Progress value={budgetProgress} className="mt-4" />
                  <div className="mt-3 flex flex-wrap justify-between gap-x-3 gap-y-1 text-base text-foreground/80">
                    <span>
                      Spent: ₹{totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span>
                      Left: ₹{budgetLeft.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex h-[116px] flex-col items-center justify-center gap-1 text-center">
                  <p className="font-headline text-xl font-bold">Set a budget to get started.</p>
                  <p className="text-base text-foreground/70">
                    Any expenses will be tracked against it.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className={cn("grid gap-6 sm:grid-cols-2 md:grid-cols-1", locked && "pointer-events-none opacity-50 saturate-50")}>
            <Card className="hover:rotate-1">
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <StatLabel>Top Spending Category</StatLabel>
              </CardHeader>
              <CardContent>
                <div className="font-headline text-2xl font-bold leading-tight sm:text-3xl">
                  {topCategory}
                </div>
                <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                  Your highest expenditure this month.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:-rotate-1">
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <StatLabel>Saved vs Last Month</StatLabel>
              </CardHeader>
              <CardContent>
                <div className="font-headline text-2xl font-bold leading-tight sm:text-3xl">
                  {savedRatio}
                </div>
                <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                  {previousMonthExpenses.length === 0 
                    ? 'No previous month record.' 
                    : 'Change in savings from previous month.'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card decoration="tape" className={cn("hover:rotate-[0.5deg]", locked && "pointer-events-none opacity-50 saturate-50")}>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>Spending Overview</CardTitle>
              <span className="rounded-sm border-2 border-foreground bg-postit px-1.5 py-0.5 font-headline text-xs font-bold uppercase tracking-wide">
                by category
              </span>
            </div>
            <CardDescription>A look at your spending by category for the selected month.</CardDescription>
          </CardHeader>
          <CardContent>
            <SpendingOverviewChart expenses={currentMonthExpenses} />
          </CardContent>
        </Card>

        <Card decoration="tape" className={cn("hover:-rotate-[0.5deg]", locked && "pointer-events-none opacity-50 saturate-50")}>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>Monthly Expenses</CardTitle>
              <span className="rounded-sm border-2 border-foreground bg-secondary px-1.5 py-0.5 font-headline text-xs font-bold uppercase tracking-wide">
                {currentMonthExpenses.length} item{currentMonthExpenses.length === 1 ? '' : 's'}
              </span>
            </div>
            <CardDescription>A list of all your recorded expenses for the selected month.</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpensesTable expenses={currentMonthExpenses} onUpdateExpense={onUpdateExpense} onDeleteExpense={onDeleteExpense} />
          </CardContent>
        </Card>
      </div>
  );
}
