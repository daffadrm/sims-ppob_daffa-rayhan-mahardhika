import { createSlice } from "@reduxjs/toolkit";

import {
  fetchBalance,
  fetchTransactionsHistory,
  postTopup,
  postTransaction,
} from "./transactionThunk";

type TransactionHistoryType = {
  invoice_number: string;
  transaction_type: string;
  created_on: string;
  description: string;
  total_amount: number;
};

interface TransactionType {
  balances: {
    balance: number;
  };
  loading: boolean;
  error: string | null;

  loadingTopup: boolean;
  errorTopup: boolean;

  transactionData: {
    service_name: string;
  };
  loadingTransaction: boolean;
  errorTransaction: string | null;

  transactionsHistory: TransactionHistoryType[];
  loadingGetHistory: boolean;
  errorGetHistory: string | null;
  offset: number;
  limit: number;
  monthFilter?: number;
  moreHistory: boolean;
}

const initialState: TransactionType = {
  balances: {
    balance: 0,
  },
  loading: false,
  error: null,

  loadingTopup: false,
  errorTopup: false,

  transactionData: {
    service_name: "",
  },
  loadingTransaction: false,
  errorTransaction: null,

  transactionsHistory: [],
  loadingGetHistory: false,
  errorGetHistory: "",
  offset: 0,
  limit: 5,
  moreHistory: false,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
      state.errorTransaction = null;
      state.errorTopup = null;
    },
    resetTransactions: (state) => {
      state.transactionsHistory = [];
      state.offset = 0;
      state.moreHistory = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balances = action.payload.data;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Error";
      });

    builder
      .addCase(postTopup.pending, (state) => {
        state.loadingTopup = true;
        state.error = null;
      })
      .addCase(postTopup.fulfilled, (state, action) => {
        state.balances = action.payload.data;
        state.loadingTopup = false;
      })
      .addCase(postTopup.rejected, (state, action) => {
        state.loadingTopup = false;
        state.error = action.payload || action.error.message || "Error";
      });

    builder
      .addCase(postTransaction.pending, (state) => {
        state.loadingTransaction = true;
        state.errorTransaction = null;
      })
      .addCase(postTransaction.fulfilled, (state, action) => {
        if (action.payload.data?.total_amount !== undefined) {
          state.balances.balance -= action.payload.data.total_amount;
        }

        state.transactionData = action.payload.data;

        state.loadingTransaction = false;
      })
      .addCase(postTransaction.rejected, (state, action) => {
        state.loadingTransaction = false;
        state.errorTransaction =
          action.payload || action.error.message || "Error";
      });

    builder
      .addCase(fetchTransactionsHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.moreHistory = false;
      })
      .addCase(fetchTransactionsHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.transactionsHistory = [
          ...state.transactionsHistory,
          ...action.payload.data.records,
        ];
        state.offset = state.offset + state.limit;
        state.moreHistory = action.payload.data.records.length > 0;
      })
      .addCase(fetchTransactionsHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Gagal fetch transaksi";
        state.moreHistory = false;
      });
  },
});
export const { clearTransactionError, resetTransactions } =
  transactionSlice.actions;

export default transactionSlice.reducer;
