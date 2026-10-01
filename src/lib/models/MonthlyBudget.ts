import { Schema, model, models } from 'mongoose';

export interface IMonthlyBudget {
  month: string; // "yyyy-MM" format
  total: number;
}

const MonthlyBudgetSchema = new Schema<IMonthlyBudget>(
  {
    month: { type: String, required: true, unique: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

// Prevent model overwrite upon hot reload in development
const MonthlyBudgetModel = models.MonthlyBudget || model<IMonthlyBudget>('MonthlyBudget', MonthlyBudgetSchema);

export default MonthlyBudgetModel;
