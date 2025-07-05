'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pen, PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';

const budgetSchema = z.object({
  budget: z.coerce.number().positive({ message: 'Budget must be a positive number.' }),
});

type EditBudgetDialogProps = {
  onUpdateBudget: (newBudget: number) => void;
  currentBudget: number;
  isBudgetSet: boolean;
};

export function EditBudgetDialog({ onUpdateBudget, currentBudget, isBudgetSet }: EditBudgetDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      budget: currentBudget,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({ budget: isBudgetSet ? currentBudget : undefined });
    }
  }, [currentBudget, form, open, isBudgetSet]);

  function onSubmit(values: z.infer<typeof budgetSchema>) {
    onUpdateBudget(values.budget);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isBudgetSet ? (
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Pen className="h-4 w-4" />
            <span className="sr-only">Edit Budget</span>
          </Button>
        ) : (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Set Budget
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isBudgetSet ? 'Edit' : 'Set'} Monthly Budget</DialogTitle>
          <DialogDescription>
            {isBudgetSet ? 'Set your new total budget for the month.' : 'Set a budget to start tracking your expenses.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 3000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
