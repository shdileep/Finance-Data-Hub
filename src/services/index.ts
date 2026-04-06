/**
 * Service Layer — Business logic between routes and models
 * Keeps route handlers thin and testable.
 */
import { UserModel, TransactionModel, SummaryModel, type TransactionFilter } from '../models/index.ts';

// ─── User Service ────────────────────────────────────────────────────────────

export const UserService = {
  getAll() {
    return UserModel.findAll();
  },

  create(data: { name: string; email: string; role: string; status: string }) {
    return UserModel.create(data);
  },

  update(id: number | string, data: { name: string; email: string; role: string; status: string }) {
    const changes = UserModel.update(id, data);
    if (changes === 0) return null;
    return { id: Number(id), ...data };
  },

  delete(id: number | string) {
    return UserModel.delete(id) > 0;
  },
};

// ─── Transaction Service ─────────────────────────────────────────────────────

export const TransactionService = {
  list(filters: TransactionFilter) {
    return TransactionModel.findFiltered(filters);
  },

  create(data: { amount: number; type: string; category: string; date: string; description?: string | null; userId: number }) {
    return TransactionModel.create(data);
  },

  update(id: number | string, data: { amount: number; type: string; category: string; date: string; description?: string | null }) {
    const changes = TransactionModel.update(id, data);
    if (changes === 0) return null;
    return { id: Number(id), ...data };
  },

  softDelete(id: number | string) {
    return TransactionModel.softDelete(id) > 0;
  },
};

// ─── Summary Service ─────────────────────────────────────────────────────────

export const SummaryService = {
  getDashboardSummary() {
    const totalIncome  = SummaryModel.getTotalIncome();
    const totalExpense = SummaryModel.getTotalExpense();

    return {
      totalIncome,
      totalExpense,
      netBalance:    totalIncome - totalExpense,
      categoryWise:  SummaryModel.getCategoryWise(),
      recentActivity: SummaryModel.getRecentActivity(),
      weeklyTrends:  SummaryModel.getWeeklyTrends(),
      monthlyTrends: SummaryModel.getMonthlyTrends(),
    };
  },
};
