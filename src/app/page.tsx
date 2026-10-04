'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AppLayout } from "@/components/app-layout";
import { DashboardContent } from "@/components/dashboard-content";
import type { Expense, MonthlyBudget } from "@/lib/types";
import { format, subMonths, addMonths, isSameMonth } from 'date-fns';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useAuth, useRequireAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, loading: authLoading } = useRequireAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyBudgets, setMonthlyBudgets] = useState<MonthlyBudget[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [expensesRes, budgetsRes] = await Promise.all([
        fetch('/api/expenses', { credentials: 'include' }),
        fetch('/api/budgets', { credentials: 'include' }),
      ]);
      if (expensesRes.ok) {
        const data: Expense[] = await expensesRes.json();
        setExpenses(data);
      }
      if (budgetsRes.ok) {
        const data: MonthlyBudget[] = await budgetsRes.json();
        setMonthlyBudgets(data);
      }
    } catch (error) {
      console.error('Failed to fetch data from MongoDB', error);
    } finally {
      setIsLoading(false);
      setSelectedMonth(new Date());
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Add Expense ───────────────────────────────────────────────────────────
  const handleAddExpense = async (newExpense: Omit<Expense, 'id' | 'date'>) => {
    if (!selectedMonth || !user) return;
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...newExpense,
          date: format(selectedMonth, 'yyyy-MM-dd'),
        }),
      });
      if (res.ok) {
        const created: Expense = await res.json();
        setExpenses(prev => [created, ...prev]);
      }
    } catch (error) {
      console.error('Failed to add expense', error);
    }
  };

  // ─── Update Expense ────────────────────────────────────────────────────────
  const handleUpdateExpense = async (updatedExpense: Expense) => {
    try {
      const res = await fetch(`/api/expenses/${updatedExpense.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedExpense),
      });
      if (res.ok) {
        const saved: Expense = await res.json();
        setExpenses(prev => prev.map(exp => exp.id === saved.id ? saved : exp));
      }
    } catch (error) {
      console.error('Failed to update expense', error);
    }
  };

  // ─── Delete Expense ────────────────────────────────────────────────────────
  const handleDeleteExpense = async (id: string) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        setExpenses(prev => prev.filter(exp => exp.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete expense', error);
    }
  };

  // ─── Update Budget ─────────────────────────────────────────────────────────
  const handleUpdateBudget = async (newTotal: number) => {
    if (!selectedMonth) return;
    const monthKey = format(selectedMonth, 'yyyy-MM');
    try {
      const res = await fetch('/api/budgets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ month: monthKey, total: newTotal }),
      });
      if (res.ok) {
        const saved: MonthlyBudget = await res.json();
        setMonthlyBudgets(prev => {
          const existingIndex = prev.findIndex(b => b.month === saved.month);
          if (existingIndex > -1) {
            const updated = [...prev];
            updated[existingIndex] = saved;
            return updated;
          }
          return [...prev, saved];
        });
      }
    } catch (error) {
      console.error('Failed to update budget', error);
    }
  };

  // ─── Delete Month ──────────────────────────────────────────────────────────
  const handleDeleteMonthExpenses = async () => {
    if (!selectedMonth) return;
    const monthKey = format(selectedMonth, 'yyyy-MM');
    try {
      const res = await fetch(`/api/budgets/month/${monthKey}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        setExpenses(prev => prev.filter(exp => !isSameMonth(new Date(exp.date), selectedMonth)));
        setMonthlyBudgets(prev => prev.filter(b => b.month !== monthKey));
      }
    } catch (error) {
      console.error('Failed to delete month data', error);
    }
  };

  // ─── Navigation ───────────────────────────────────────────────────────────
  const handlePrevMonth = () => setSelectedMonth(prev => prev ? subMonths(prev, 1) : null);
  const handleNextMonth = () => setSelectedMonth(prev => prev ? addMonths(prev, 1) : null);

  // ─── Derived Data ─────────────────────────────────────────────────────────
  const { currentMonthExpenses, previousMonthExpenses, currentBudget } = useMemo(() => {
    if (!selectedMonth) {
      return { currentMonthExpenses: [], previousMonthExpenses: [], currentBudget: null };
    }
    const monthKey = format(selectedMonth, 'yyyy-MM');
    const lastMonthDate = subMonths(selectedMonth, 1);

    const current = expenses.filter(expense => isSameMonth(new Date(expense.date), selectedMonth));
    const previous = expenses.filter(expense => isSameMonth(new Date(expense.date), lastMonthDate));
    const budget = monthlyBudgets.find(b => b.month === monthKey)?.total ?? null;

    return { currentMonthExpenses: current, previousMonthExpenses: previous, currentBudget: budget };
  }, [expenses, monthlyBudgets, selectedMonth]);

  const isBudgetSet = currentBudget !== null;

  if (authLoading || isLoading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <AppLayout
      onAddExpense={handleAddExpense}
      selectedMonth={selectedMonth}
      onPrevMonth={handlePrevMonth}
      onNextMonth={handleNextMonth}
      onDeleteMonthExpenses={handleDeleteMonthExpenses}
      isBudgetSet={isBudgetSet}
    >
      <DashboardContent
        currentMonthExpenses={currentMonthExpenses}
        previousMonthExpenses={previousMonthExpenses}
        onUpdateExpense={handleUpdateExpense}
        onDeleteExpense={handleDeleteExpense}
        budgetGoal={currentBudget}
        onUpdateBudget={handleUpdateBudget}
      />
    </AppLayout>
  );
}
