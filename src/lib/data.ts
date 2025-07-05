import type { Expense, Category, MonthlyBudget } from './types';
import { UtensilsCrossed, Home, Car, Tv, Lightbulb, HeartPulse, ShoppingBag, MoreHorizontal, FileText, ShoppingCart, GraduationCap, Gift } from 'lucide-react';

export const categories: Category[] = [
  { name: 'Food', icon: UtensilsCrossed, color: 'hsl(var(--chart-1))' },
  { name: 'Housing', icon: Home, color: 'hsl(var(--chart-2))' },
  { name: 'Transportation', icon: Car, color: 'hsl(var(--chart-3))' },
  { name: 'Entertainment', icon: Tv, color: 'hsl(var(--chart-4))' },
  { name: 'Utilities', icon: Lightbulb, color: 'hsl(var(--chart-5))' },
  { name: 'Health', icon: HeartPulse, color: 'hsl(var(--primary))' },
  { name: 'Shopping', icon: ShoppingBag, color: 'hsl(var(--accent))' },
  { name: 'Subscriptions', icon: FileText, color: '#FF6347' },
  { name: 'Groceries', icon: ShoppingCart, color: '#4682B4' },
  { name: 'Personal Care', icon: HeartPulse, color: '#32CD32' },
  { name: 'Gifts', icon: Gift, color: '#FFD700' },
  { name: 'Education', icon: GraduationCap, color: '#6A5ACD' },
  { name: 'Other', icon: MoreHorizontal, color: 'hsl(var(--muted-foreground))' },
];

export const initialExpenses: Expense[] = [];

export const initialMonthlyBudgets: MonthlyBudget[] = [];
