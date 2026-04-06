/**
 * Validation Schemas — Zod schemas for request body validation
 * Serves as both runtime validation and living API documentation.
 */
import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  description: z.string().optional(),
});

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  role: z.enum(['Admin', 'Analyst', 'Viewer']),
  status: z.enum(['active', 'inactive']).default('active'),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
export type UserInput = z.infer<typeof userSchema>;
