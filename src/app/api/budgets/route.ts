import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MonthlyBudgetModel from '@/lib/models/MonthlyBudget';
import { getUserIdFromRequest } from '@/lib/get-user-id';

// GET /api/budgets - fetch all monthly budgets for the authenticated user
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const budgets = await MonthlyBudgetModel.find({ userId }).lean();
    const mapped = budgets.map((b) => ({
      userId: b.userId,
      month: b.month,
      total: b.total,
    }));
    return NextResponse.json(mapped);
  } catch (error) {
    console.error('GET /api/budgets error:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

// PUT /api/budgets - upsert a monthly budget for the authenticated user
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const { month, total } = body;
    if (!month || total === undefined) {
      return NextResponse.json({ error: 'month and total are required' }, { status: 400 });
    }
    const budget = await MonthlyBudgetModel.findOneAndUpdate(
      { userId, month },
      { total },
      { upsert: true, returnDocument: 'after' }
    ).lean();
    return NextResponse.json({ userId: budget!.userId, month: budget!.month, total: budget!.total });
  } catch (error) {
    console.error('PUT /api/budgets error:', error);
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
  }
}