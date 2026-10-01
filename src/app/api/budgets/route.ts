import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MonthlyBudgetModel from '@/lib/models/MonthlyBudget';

// GET /api/budgets - fetch all monthly budgets
export async function GET() {
  try {
    await dbConnect();
    const budgets = await MonthlyBudgetModel.find({}).lean();
    const mapped = budgets.map((b) => ({
      month: b.month,
      total: b.total,
    }));
    return NextResponse.json(mapped);
  } catch (error) {
    console.error('GET /api/budgets error:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

// PUT /api/budgets - upsert a monthly budget
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { month, total } = body;
    if (!month || total === undefined) {
      return NextResponse.json({ error: 'month and total are required' }, { status: 400 });
    }
    const budget = await MonthlyBudgetModel.findOneAndUpdate(
      { month },
      { total },
      { upsert: true, new: true }
    ).lean();
    return NextResponse.json({ month: budget!.month, total: budget!.total });
  } catch (error) {
    console.error('PUT /api/budgets error:', error);
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
  }
}
