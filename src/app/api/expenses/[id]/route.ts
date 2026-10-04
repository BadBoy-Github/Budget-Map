import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import ExpenseModel from '@/lib/models/Expense';
import { getUserIdFromRequest } from '@/lib/get-user-id';

// PUT /api/expenses/[id] - update an expense for the authenticated user
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }
    const body = await req.json();
    const { name, amount, category, date, notes } = body;
    const updated = await ExpenseModel.findByIdAndUpdate(
      { _id: id, userId },
      { name, amount, category, date, notes },
      { new: true }
    ).lean();
    if (!updated) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    return NextResponse.json({
      id: updated._id!.toString(),
      userId: updated.userId,
      name: updated.name,
      amount: updated.amount,
      category: updated.category,
      date: updated.date,
      notes: updated.notes,
    });
  } catch (error) {
    console.error('PUT /api/expenses/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

// DELETE /api/expenses/[id] - delete an expense for the authenticated user
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const userId = getUserIdFromRequest(_req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }
    const deleted = await ExpenseModel.findOneAndDelete({ _id: id, userId }).lean();
    if (!deleted) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/expenses/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}