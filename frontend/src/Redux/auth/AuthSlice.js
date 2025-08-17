import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_BASE_URL;


// Async Thunk to fetch user profile using /users/:id
export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async ({ token, id }, thunkAPI) => {
    try {
      const res = await axios.get(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update localStorage with latest user
      localStorage.setItem("user", JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      // Handle expired session or error
      toast.error("Session expired. Please login again.", { autoClose: 1500 });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return thunkAPI.rejectWithValue("Session expired");
    }
  }
);

const  initialState={
        isAuthenticated:false,
        user:"",
        token: '',
        isLoading:true
    }

const AuthSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        loginSuccess:(state,action)=>{
            state.isAuthenticated = true;
            state.user = action.payload.user
            state.token = action.payload.token
            state.isLoading = false
        },
        logout:(state)=>{
            state.isAuthenticated = false;
            state.user = ''
            state.token = '',
            state.isLoading = false
        },
        setAuthLoaded:(state)=>{
            state.isLoading = false
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(getUserProfile.fulfilled, (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.isLoading = false;
          })
          .addCase(getUserProfile.rejected, (state) => {
            state.isAuthenticated = false;
            state.user = '';
            state.token = '';
            state.isLoading = false;
          });
      }
      

})


export const {loginSuccess,logout,setAuthLoaded} = AuthSlice.actions
export default AuthSlice.reducer
