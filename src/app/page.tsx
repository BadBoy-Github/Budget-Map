'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AppLayout } from "@/components/app-layout";
import { DashboardContent } from "@/components/dashboard-content";
import type { Expense, MonthlyBudget } from "@/lib/types";
import { format, subMonths, addMonths, isSameMonth } from 'date-fns';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyBudgets, setMonthlyBudgets] = useState<MonthlyBudget[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);

  // Load data from localStorage on initial client-side render
  useEffect(() => {
    try {
      const storedExpenses = localStorage.getItem('my-wallet-expenses');
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
      }
      const storedBudgets = localStorage.getItem('my-wallet-budgets');
      if (storedBudgets) {
        setMonthlyBudgets(JSON.parse(storedBudgets));
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
    }
    // Set the initial month on the client to avoid hydration errors
    setSelectedMonth(new Date());
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    // We only save when selectedMonth is not null, which means we are on the client
    // and initialization is complete.
    if (selectedMonth) {
      localStorage.setItem('my-wallet-expenses', JSON.stringify(expenses));
      localStorage.setItem('my-wallet-budgets', JSON.stringify(monthlyBudgets));
    }
  }, [expenses, monthlyBudgets, selectedMonth]);

  const handleAddExpense = (newExpense: Omit<Expense, 'id' | 'date'>) => {
    if (!selectedMonth) return;
    setExpenses(prev => [{ 
      ...newExpense, 
      id: Date.now().toString(),
      date: format(selectedMonth, 'yyyy-MM-dd')
    }, ...prev]);
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    setExpenses(prev => prev.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp));
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  const handleUpdateBudget = (newTotal: number) => {
    if (!selectedMonth) return;
    const monthKey = format(selectedMonth, 'yyyy-MM');
    setMonthlyBudgets(prev => {
      const existingBudgetIndex = prev.findIndex(b => b.month === monthKey);
      if (existingBudgetIndex > -1) {
        const newBudgets = [...prev];
        newBudgets[existingBudgetIndex] = { ...newBudgets[existingBudgetIndex], total: newTotal };
        return newBudgets;
      } else {
        return [...prev, { month: monthKey, total: newTotal }];
      }
    });
  };

  const handlePrevMonth = () => {
    setSelectedMonth(prev => prev ? subMonths(prev, 1) : null);
  };

  const handleNextMonth = () => {
    setSelectedMonth(prev => prev ? addMonths(prev, 1) : null);
  };

  const handleDeleteMonthExpenses = () => {
    if (!selectedMonth) return;
    const monthKey = format(selectedMonth, 'yyyy-MM');
    setExpenses(prev => prev.filter(exp => !isSameMonth(new Date(exp.date), selectedMonth)));
    setMonthlyBudgets(prev => prev.filter(b => b.month !== monthKey));
  };

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
  
  if (!selectedMonth) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
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
