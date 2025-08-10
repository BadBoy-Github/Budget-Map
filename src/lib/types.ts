import type { LucideIcon } from 'lucide-react';

export type Expense = {
  id: string;
  name: string;
  amount: number;
  category: string; // Category name
  date: string; // YYYY-MM-DD
  notes?: string;
};

export type Category = {
  name: string;
  icon: LucideIcon;
  color: string;
};

export type MonthlyBudget = {
  month: string; // "yyyy-MM" format
  total: number;
};
