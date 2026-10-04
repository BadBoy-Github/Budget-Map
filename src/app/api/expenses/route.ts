import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import ExpenseModel from '@/lib/models/Expense';
import { getUserIdFromRequest } from '@/lib/get-user-id';

// GET /api/expenses - fetch expenses for the authenticated user
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const expenses = await ExpenseModel.find({ userId })
      .sort({ date: -1, createdAt: -1 })
      .lean();
    const mapped = expenses.map((e) => ({
      id: e._id!.toString(),
      userId: e.userId,
      name: e.name,
      amount: e.amount,
      category: e.category,
      date: e.date,
      notes: e.notes,
    }));
    return NextResponse.json(mapped);
  } catch (error) {
    console.error('GET /api/expenses error:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

// POST /api/expenses - add a new expense for the authenticated user
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const { name, amount, category, date, notes } = body;
    const expense = await ExpenseModel.create({ userId, name, amount, category, date, notes });
    return NextResponse.json({
      id: expense._id.toString(),
      userId: expense.userId,
      name: expense.name,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      notes: expense.notes,
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/expenses error:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}