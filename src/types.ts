export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Analyst' | 'Viewer';
  status: 'active' | 'inactive';
}

export interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description: string | null;
  userId: number;
  is_flagged?: number;
}

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  categoryWise: { category: string; total: number; type: 'income' | 'expense' }[];
  recentActivity: Transaction[];
  weeklyTrends: { date: string; income: number; expense: number }[];
}
