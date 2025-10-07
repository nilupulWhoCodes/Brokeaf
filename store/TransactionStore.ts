import { TransactionTypes } from "@/enums/TransactionsEnum";
import { supabase } from "@/supabase";
import { Transaction } from "@/types/common";
import { makeAutoObservable, runInAction } from "mobx";

class TransactionStore {
  transactions: Transaction[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get totalIncome() {
    return this.transactions
      .filter((t) => t.type === TransactionTypes.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }

  get totalExpense() {
    return this.transactions
      .filter((t) => t.type === TransactionTypes.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }

  get totalBalance() {
    return this.totalIncome - this.totalExpense;
  }

  async fetchTransactions(userId: string) {
    this.loading = true;
    this.error = null;

    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false })
        .eq("userId", userId);

      if (error) throw error;

      runInAction(() => {
        this.transactions = data as Transaction[];
      });
    } catch (err: any) {
      runInAction(() => {
        this.error = err?.message || "Failed to fetch transactions";
      });
      throw this.error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async addTransaction(payload: any) {
    this.loading = true;
    this.error = null;

    try {
      const { data, error } = await supabase
        .from("transactions")
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      runInAction(() => {
        // add new transaction to the top
        this.transactions = [data as Transaction, ...this.transactions];
      });

      return data;
    } catch (err: any) {
      runInAction(() => {
        this.error = err?.message || "Failed to add transaction";
      });
      throw this.error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async updateTransaction(id: string, payload: any) {
    this.loading = true;
    this.error = null;

    try {
      const { data, error } = await supabase
        .from("transactions")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      runInAction(() => {
        this.transactions = this.transactions.map((t) =>
          t.id === Number(id) ? (data as Transaction) : t
        );
      });

      return data;
    } catch (err: any) {
      runInAction(() => {
        this.error = err?.message || "Failed to update transaction";
      });
      throw this.error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
  async deleteTransaction(id: string) {
    this.loading = true;
    this.error = null;

    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      runInAction(() => {
        this.transactions = this.transactions.filter(
          (t) => t.id !== Number(id)
        );
      });
    } catch (err: any) {
      runInAction(() => {
        this.error = err?.message || "Failed to delete transaction";
      });
      throw this.error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const transactionStore = new TransactionStore();
