import { TransactionTypes } from "@/enums/TransactionsEnum";

export type Transaction = {
  id: number;
  userId: string;
  type: TransactionTypes;
  amount: number;
  category: string;
  description?: string;
  date: string;
  createdAt: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  occupation: string;
  isNewUser: boolean;
};

export type TransactionFilters = {
  type: "all" | "income" | "expense";
  category?: string;
  dateRange?: { from: Date; to: Date };
};
