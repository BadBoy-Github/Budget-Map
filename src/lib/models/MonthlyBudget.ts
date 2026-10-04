import { Schema, model, models } from 'mongoose';

export interface IMonthlyBudget {
  userId: string;
  month: string; // "yyyy-MM" format
  total: number;
}

const MonthlyBudgetSchema = new Schema<IMonthlyBudget>(
  {
    userId: { type: String, required: true, index: true },
    month: { type: String, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

// Compound index for unique month per user
MonthlyBudgetSchema.index({ userId: 1, month: 1 }, { unique: true });

// Prevent model overwrite upon hot reload in development
const MonthlyBudgetModel = models.MonthlyBudget || model<IMonthlyBudget>('MonthlyBudget', MonthlyBudgetSchema);

export default MonthlyBudgetModel;
