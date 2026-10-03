'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash } from 'lucide-react';
import { format } from 'date-fns';

type DeleteMonthDialogProps = {
  onDelete: () => void;
  selectedMonth: Date;
  disabled?: boolean;
};

export function DeleteMonthDialog({ onDelete, selectedMonth, disabled }: DeleteMonthDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" disabled={disabled} className="shrink-0">
          <Trash className="stroke-[2.5]" />
          <span className="sr-only">Delete all expenses for this month</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all expense and budget data for{' '}
            <strong className="font-headline text-foreground">{format(selectedMonth, 'MMMM yyyy')}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} variant="destructive">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
