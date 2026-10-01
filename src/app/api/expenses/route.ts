import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ExpenseModel from '@/lib/models/Expense';

// GET /api/expenses - fetch all expenses
export async function GET() {
  try {
    await dbConnect();
    const expenses = await ExpenseModel.find({}).sort({ date: -1, createdAt: -1 }).lean();
    // Map _id to id for the frontend
    const mapped = expenses.map((e) => ({
      id: e._id!.toString(),
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

// POST /api/expenses - add a new expense
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, amount, category, date, notes } = body;
    const expense = await ExpenseModel.create({ name, amount, category, date, notes });
    return NextResponse.json({
      id: expense._id.toString(),
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
