'use client';

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pen, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { categories } from '@/lib/data';
import type { Expense } from '@/lib/types';
import { Textarea } from './ui/textarea';

const expenseSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  amount: z.coerce.number().positive({ message: 'Amount must be a positive number.' }),
  category: z.string({ required_error: 'Please select a category.' }),
  notes: z.string().optional(),
});

interface ExpensesTableProps {
  expenses: Expense[];
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

export function ExpensesTable({ expenses, onUpdateExpense, onDeleteExpense }: ExpensesTableProps) {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
  });

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    form.reset({
      name: expense.name,
      amount: expense.amount,
      category: expense.category,
      notes: expense.notes || '',
    });
  };

  const handleUpdate = (values: z.infer<typeof expenseSchema>) => {
    if (editingExpense) {
      onUpdateExpense({ ...editingExpense, ...values });
      setEditingExpense(null);
    }
  };
  
  const handleDeleteConfirm = () => {
    if (deletingExpenseId) {
      onDeleteExpense(deletingExpenseId);
      setDeletingExpenseId(null);
    }
  };
  
  const getCategory = (categoryName: string) => categories.find(c => c.name === categoryName);

  // Shared between the desktop table row and the mobile receipt slip
  const ExpenseActions = ({ expense }: { expense: Expense }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0">
          <span className="sr-only">Open menu for {expense.name}</span>
          <MoreHorizontal className="stroke-[2.5]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleEdit(expense)}>
          <Pen className="stroke-[2.5]" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDeletingExpenseId(expense.id)}>
          <Trash className="stroke-[2.5]" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const CategoryBadge = ({ expense }: { expense: Expense }) => {
    const category = getCategory(expense.category);
    if (!category) return null;
    return (
      <Badge variant="outline" className="w-fit max-w-[10rem] gap-1.5 truncate">
        <category.icon className="size-3.5 shrink-0" style={{ color: category.color }} />
        <span className="truncate">{expense.category}</span>
      </Badge>
    );
  };

  return (
    <>
      {expenses.length === 0 ? (
        <div className="flex flex-col items-center gap-1 rounded-md border-2 border-dashed border-foreground/50 bg-postit/40 px-4 py-8 text-center">
          <p className="font-headline text-xl font-bold">Nothing scribbled here yet</p>
          <p className="text-base text-muted-foreground">
            Add your first expense for this month and it will show up in this list.
          </p>
        </div>
      ) : (
        <>
          {/* Phones: each expense becomes a little receipt slip */}
          <ul className="space-y-3 sm:hidden">
            {expenses.map((expense) => (
              <li
                key={expense.id}
                className="flex items-start justify-between gap-2 rounded-md border-2 border-foreground bg-card p-3 shadow-sketch-soft"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate text-lg font-medium" title={expense.name}>
                    {expense.name}
                  </p>
                  <CategoryBadge expense={expense} />
                  {expense.notes && (
                    <p className="truncate text-sm text-muted-foreground" title={expense.notes}>
                      {expense.notes}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="whitespace-nowrap font-headline text-lg font-bold">
                    ₹{expense.amount.toFixed(2)}
                  </span>
                  <ExpenseActions expense={expense} />
                </div>
              </li>
            ))}
          </ul>

          {/* Tablet and up: the original table */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[52px]"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="max-w-[10rem] truncate font-medium md:max-w-[15rem]" title={expense.name}>
                      {expense.name}
                    </TableCell>
                    <TableCell>
                      <CategoryBadge expense={expense} />
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate text-muted-foreground" title={expense.notes}>
                      {expense.notes || '-'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-headline text-lg font-bold">
                      ₹{expense.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <ExpenseActions expense={expense} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingExpense} onOpenChange={(isOpen) => !isOpen && setEditingExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>Update the details of your expense.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4 py-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl><Input type="number" inputMode="decimal" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.name} value={cat.name}>
                          <div className="flex items-center gap-2">
                            <cat.icon className="size-4 shrink-0" />
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="e.g. Lunch meeting with client" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingExpense(null)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Alert Dialog */}
      <AlertDialog open={!!deletingExpenseId} onOpenChange={(isOpen) => !isOpen && setDeletingExpenseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete your expense.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingExpenseId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} variant="destructive">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
