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
    <div className="flex min-h-dvh w-full flex-col bg-background">
      <header className="sticky top-0 z-30 border-b-[3px] border-foreground bg-background/95 backdrop-blur-[2px]">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-3 sm:py-2 md:px-8">
          <div className="flex items-center gap-2.5">
            {/* Logo stamped on the page, slightly off-kilter */}
            <div className="flex h-11 w-11 -rotate-3 items-center justify-center rounded-md border-[3px] border-foreground bg-primary text-primary-foreground shadow-sketch">
              <Icons.logo className="size-6 stroke-[2.5]" />
            </div>
            <span className="wavy-underline font-headline text-2xl font-bold leading-none sm:text-3xl">
              Budget Map
            </span>
          </div>

          <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-nowrap sm:gap-3">
            {/* Month pager — the month itself reads like a pinned sticky note */}
            <div className="flex shrink items-center gap-1.5 sm:gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={onPrevMonth}
                aria-label="Previous month"
                disabled={!selectedMonth}
                className="shrink-0"
              >
                <ChevronLeft className="stroke-[2.5]" />
              </Button>
              <span
                className="-rotate-1 whitespace-nowrap rounded-sm border-2 border-foreground bg-postit px-1.5 py-0.5 text-center font-headline text-base font-bold shadow-sketch-sm sm:text-lg"
                aria-live="polite"
              >
                {selectedMonth ? format(selectedMonth, "MMM yyyy") : '...'}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={onNextMonth}
                aria-label="Next month"
                disabled={!selectedMonth}
                className="shrink-0"
              >
                <ChevronRight className="stroke-[2.5]" />
              </Button>
            </div>
            {selectedMonth && (
              <DeleteMonthDialog
                onDelete={onDeleteMonthExpenses}
                selectedMonth={selectedMonth}
                disabled={!isBudgetSet}
              />
            )}
            <AddExpenseDialog onAddExpense={onAddExpense} disabled={!isBudgetSet || !selectedMonth} />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:py-6 md:px-8 md:py-8">
        {children}
      </main>
    </div>
  );
}
