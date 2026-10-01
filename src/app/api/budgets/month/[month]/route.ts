import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ExpenseModel from '@/lib/models/Expense';
import MonthlyBudgetModel from '@/lib/models/MonthlyBudget';

// DELETE /api/budgets/month/[month] - delete all expenses & budget for a month (e.g. "2024-01")
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ month: string }> }) {
  try {
    await dbConnect();
    const { month } = await params;
    // Delete all expenses whose date starts with "yyyy-MM"
    await ExpenseModel.deleteMany({ date: { $regex: `^${month}` } });
    // Delete the monthly budget
    await MonthlyBudgetModel.deleteOne({ month });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/budgets/month/[month] error:', error);
    return NextResponse.json({ error: 'Failed to delete month data' }, { status: 500 });
  }
}
