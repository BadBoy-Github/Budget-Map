import mongoose, { Schema, model, models } from 'mongoose';

export interface IExpense {
  _id?: mongoose.Types.ObjectId | string;
  userId: string;
  name: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  notes?: string;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

// Prevent model overwrite upon hot reload in development
const ExpenseModel = models.Expense || model<IExpense>('Expense', ExpenseSchema);

export default ExpenseModel;
