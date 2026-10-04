import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ExpenseModel from '@/lib/models/Expense';
import MonthlyBudgetModel from '@/lib/models/MonthlyBudget';
import { getUserIdFromRequest } from '@/lib/get-user-id';

// DELETE /api/budgets/month/[month] - delete all expenses & budget for a month for the authenticated user
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ month: string }> }) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { month } = await params;
    // Delete all expenses whose date starts with "yyyy-MM" for this user
    await ExpenseModel.deleteMany({ userId, date: { $regex: `^${month}` } });
    // Delete the monthly budget for this user
    await MonthlyBudgetModel.deleteOne({ userId, month });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/budgets/month/[month] error:', error);
    return NextResponse.json({ error: 'Failed to delete month data' }, { status: 500 });
  }
}