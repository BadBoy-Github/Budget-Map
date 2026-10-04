import type { LucideIcon } from 'lucide-react';

export type Expense = {
  id: string;
  userId?: string;
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
  userId: string;
  month: string; // "yyyy-MM" format
  total: number;
};

export type User = {
  id: string;
  userId: string; // 13-digit alphanumeric
  email: string;
  name: string;
};
