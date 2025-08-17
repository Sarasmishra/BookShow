// src/Redux/borrowing/borrowingSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;


// Fetch user's borrowings
export const fetchMyBorrowings = createAsyncThunk(
  "borrowing/fetchMyBorrowings",
  async (token, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/my-borrowings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.allBorrowing;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch borrowings");
    }
  }
);

// Return book
export const returnBook = createAsyncThunk(
  "borrowing/returnBook",
  async ({ transactionId, token }, thunkAPI) => {
    try {
      await axios.put(
        `${BASE_URL}/api/return/${transactionId}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return transactionId;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to return book");
    }
  }
);

// Get all borrowings (admin only)
export const getAllBorrowings = createAsyncThunk(
    "borrowing/getAllBorrowings",
    async (token, thunkAPI) => {
      try {
        const res = await axios.get(`${BASE_URL}/api/borrowings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.AllTransactions || [];
      } catch (err) {
        return thunkAPI.rejectWithValue("Failed to fetch all borrowings");
      }
    }
  );

  // Borrow a book thunk
export const borrowBook = createAsyncThunk(
  "borrowing/borrowBook",
  async ({ bookId, dueDate, token }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/borrow`,
        { bookId, dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to borrow book"
      );
    }
  }
);
  

const borrowingSlice = createSlice({
  name: "borrowing",
  initialState: {
    myBorrowings: [],
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBorrowings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyBorrowings.fulfilled, (state, action) => {
        state.loading = false;
        state.myBorrowings = action.payload;
      })
      .addCase(fetchMyBorrowings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(returnBook.fulfilled, (state, action) => {
        state.myBorrowings = state.myBorrowings.filter(
          (b) => b._id !== action.payload
        );
      })
      .addCase(getAllBorrowings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBorrowings.fulfilled, (state, action) => {
        state.loading = false;
        state.myBorrowings = action.payload;
      })
      .addCase(getAllBorrowings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default borrowingSlice.reducer;
