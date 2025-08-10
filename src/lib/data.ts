import type { Expense, Category, MonthlyBudget } from './types';
import { UtensilsCrossed, Home, Car, Tv, Lightbulb, HeartPulse, ShoppingBag, MoreHorizontal, FileText, ShoppingCart, GraduationCap, Gift } from 'lucide-react';

const categoryColors = [
  "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5",
  "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50",
  "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800",
  "#FF5722", "#795548", "#9E9E9E", "#607D8B", "#F44336",
  "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3",
  "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A",
  "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722",
  "#795548", "#9E9E9E", "#607D8B", "#d32f2f", "#c2185b",
  "#7b1fa2", "#512da8", "#303f9f", "#1976d2", "#0288d1",
  "#0097a7", "#00796b", "#388e3c", "#689f38", "#afb42b"
];

export const categories: Category[] = [
  { name: 'Food', icon: UtensilsCrossed, color: categoryColors[0] },
  { name: 'Housing', icon: Home, color: categoryColors[1] },
  { name: 'Transportation', icon: Car, color: categoryColors[2] },
  { name: 'Entertainment', icon: Tv, color: categoryColors[3] },
  { name: 'Utilities', icon: Lightbulb, color: categoryColors[4] },
  { name: 'Health', icon: HeartPulse, color: categoryColors[5] },
  { name: 'Shopping', icon: ShoppingBag, color: categoryColors[6] },
  { name: 'Subscriptions', icon: FileText, color: categoryColors[7] },
  { name: 'Groceries', icon: ShoppingCart, color: categoryColors[8] },
  { name: 'Personal Care', icon: HeartPulse, color: categoryColors[9] },
  { name: 'Gifts', icon: Gift, color: categoryColors[10] },
  { name: 'Education', icon: GraduationCap, color: categoryColors[11] },
  { name: 'Other', icon: MoreHorizontal, color: categoryColors[12] },
];

export const initialExpenses: Expense[] = [];

export const initialMonthlyBudgets: MonthlyBudget[] = [];
