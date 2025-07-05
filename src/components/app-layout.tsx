'use client';

import React from 'react';
import { Icons } from './icons';
import { AddExpenseDialog } from './add-expense-dialog';
import type { Expense } from '@/lib/types';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { DeleteMonthDialog } from './delete-month-dialog';

export function AppLayout({ 
  children, 
  onAddExpense, 
  selectedMonth, 
  onPrevMonth, 
  onNextMonth, 
  onDeleteMonthExpenses, 
  isBudgetSet 
}: { 
  children: React.ReactNode, 
  onAddExpense: (expense: Omit<Expense, 'id' | 'date'>) => void,
  selectedMonth: Date | null,
  onPrevMonth: () => void,
  onNextMonth: () => void,
  onDeleteMonthExpenses: () => void;
  isBudgetSet: boolean;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6 z-10">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Icons.logo className="size-6" />
          </div>
          <span className="text-xl font-bold font-headline">Budget Map</span>
        </div>
        
        <div className="flex items-center gap-x-2 sm:gap-x-4">
          <div className="flex items-center gap-x-1 sm:gap-x-2">
            <Button variant="outline" size="icon" onClick={onPrevMonth} className="h-8 w-8" disabled={!selectedMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm sm:text-lg font-medium w-28 sm:w-32 text-center">
              {selectedMonth ? format(selectedMonth, "MMMM yyyy") : '...'}
            </span>
            <Button variant="outline" size="icon" onClick={onNextMonth} className="h-8 w-8" disabled={!selectedMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          {selectedMonth && <DeleteMonthDialog onDelete={onDeleteMonthExpenses} selectedMonth={selectedMonth} disabled={!isBudgetSet} />}
          <AddExpenseDialog onAddExpense={onAddExpense} disabled={!isBudgetSet || !selectedMonth} />
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
