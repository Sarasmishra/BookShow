// src/Redux/author/authorSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;


// Fetch all authors (supports filtering + pagination)
export const fetchAuthors = createAsyncThunk(
  "author/fetchAuthors",
  async ({ token, filters = {} }, thunkAPI) => {
    try {
      const { name, nationality, sort, page = 1, limit = 6 } = filters;

      const queryParams = new URLSearchParams();
      if (name) queryParams.append("name", name);
      if (nationality) queryParams.append("nationality", nationality);
      if (sort) queryParams.append("sort", sort);
      queryParams.append("page", page);
      queryParams.append("limit", limit);

      const res = await axios.get(
        `${BASE_URL}/api/authors?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch authors"
      );
    }
  }
);

// Get single author by ID
export const fetchAuthorById = createAsyncThunk(
  "author/fetchAuthorById",
  async ({ id, token }, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/authors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch author"
      );
    }
  }
);
export const fetchAllAuthors = createAsyncThunk(
  "author/fetchAllAuthors",
  async (token , thunkAPI) => {
    console.log("token",token)
    try {
      const res = await axios.get(`${BASE_URL}/api/authors/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch author"
      );
    }
  }
);

export const createAuthor = createAsyncThunk(
  "author/createAuthor",
  async ({ formData, token }, thunkAPI) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/authors`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data; // the newly created author
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to create author");
    }
  }
);


// Update Author
export const updateAuthor = createAsyncThunk(
  'author/updateAuthor',
  async ({ id, formData, token }, thunkAPI) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/authors/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update author');
    }
  }
);

// Delete Author
export const deleteAuthor = createAsyncThunk(
  'author/deleteAuthor',
  async ({ id, token }, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/api/authors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id; // return deleted ID for removal
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete author');
    }
  }
);

const authorSlice = createSlice({
  name: "author",
  initialState: {
    authors: [],
    selectedAuthor: null,
    loading: false,
    error: "",
    totalPages: 1,
  },
  reducers: {
    clearSelectedAuthor: (state) => {
      state.selectedAuthor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = action.payload.authors;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAuthorById.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchAuthorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAuthor = action.payload;
      })
      .addCase(fetchAuthorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
            .addCase(fetchAllAuthors.pending, (state) => {
              state.loading = true;
              state.error = "";
            })
            .addCase(fetchAllAuthors.fulfilled, (state, action) => {
              state.loading = false;
              state.authors = action.payload;
            })
            .addCase(fetchAllAuthors.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
            })
      .addCase(createAuthor.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(createAuthor.fulfilled, (state, action) => {
        state.loading = false;
        state.authors.push(action.payload); // optional: add new author directly to state
      })
      .addCase(createAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAuthor.fulfilled, (state, action) => {
        const index = state.authors.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.authors[index] = action.payload;
        }
      })
      .addCase(deleteAuthor.fulfilled, (state, action) => {
        state.authors = state.authors.filter((a) => a._id !== action.payload);
      })
  },
});

export const { clearSelectedAuthor } = authorSlice.actions;
export default authorSlice.reducer;
