// src/Redux/book/bookSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchBooks = createAsyncThunk(
    "book/fetchBooks",
    async ({ token, filters }, thunkAPI) => {
      try {
        const { genre, author, title, sort, page = 1, limit = 6 } = filters;
  
        const queryParams = new URLSearchParams();
  
        if (genre) queryParams.append("genre", genre);
        if (author) queryParams.append("author", author);
        if (title) queryParams.append("title", title);
        if (sort) queryParams.append("sort", sort);
        queryParams.append("page", page);
        queryParams.append("limit", limit);
  
        const res = await axios.get(`${BASE_URL}/api/books?${queryParams.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        return res.data;
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch books");
      }
    }
  );
  

// Get single book
export const fetchBookById = createAsyncThunk("book/fetchBookById", async ({ id, token }, thunkAPI) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/books/${id}`, {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch book");
  }
});


// Get all books (admin route)
export const fetchAllBooksRaw = createAsyncThunk(
  "book/fetchAllBooksRaw",
  async (token, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/books/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data; // assuming it returns an array of books
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch all books");
    }
  }
);


export const updateBookById = createAsyncThunk(
  "book/updateBook",
  async ({ id, updatedData, token }, thunkAPI) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/books/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to update book");
    }
  }
);

export const deleteBookById = createAsyncThunk(
  "book/deleteBook",
  async ({ id, token }, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/api/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to delete book");
    }
  }
);
// SUBMIT REVIEW THUNK
export const submitReview = createAsyncThunk(
  "book/submitReview",
  async ({ id, token, rating, comment  }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/books/${id}/review`,
        {rating,comment},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data; // assuming the updated book is returned
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to submit review"
      );
    }
  }
);



const bookSlice = createSlice({
  name: "book",
  initialState: {
    books: [],
    selectedBook: null,
    loading: false,
    error: "",
  },
  reducers: {
    clearSelectedBook: (state) => {
      state.selectedBook = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.books;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllBooksRaw.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchAllBooksRaw.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchAllBooksRaw.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBookById.fulfilled, (state, action) => {
        const index = state.books.findIndex(book => book._id === action.payload._id);
        if (index !== -1) state.books[index] = action.payload;
      })
      .addCase(deleteBookById.fulfilled, (state, action) => {
        state.books = state.books.filter(book => book._id !== action.payload);
      })
      .addCase(submitReview.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBook = action.payload; // update current book with new review
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      

  },
});

export const { clearSelectedBook } = bookSlice.actions;
export default bookSlice.reducer;
