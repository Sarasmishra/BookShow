// src/routes/AppRoutes.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/common/Layout";
import Home from '../pages/Home'
import Register from '../features/auth/Register'
import Login from '../features/auth/Login'
import Unauthorized from '../features/auth/Unauthorized'
import Profile from '../features/auth/Profile'
import Books from '../features/books/Books'
import BookDetails from '../features/books/BookDetails'
import Authors from '../features/books/Authors'
import BorrowBook from '../features/books/BorrowBook'
import BorrowedBooks from '../features/books/BorrowedBooks'
import MyBorrowings from '../features/books/MyBorrowings'
import DashboardHome from '../features/dashboard/DashboardHome'
import AllAuthors from '../features/users/AllAuthors'
import AllUsers from "../features/users/AllUsers";
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import MemberRoute from './MemberRoute'
import DashboardLayout from'../components/dashboard/DashboardLayout'
import AuthorDetails from "../features/books/AuthorDetails";
import AddBook from "../features/dashboard/AddBooks";
import AllBooks from "../features/dashboard/AllBooks";


const AppRoutes = () => {
  return (
    <Routes>

      {/* ✅ Public Routes with Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 🔒 Protected User Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <Books />
            </ProtectedRoute>
          }
        />
                <Route
          path="/authors"
          element={
            <ProtectedRoute>
              <Authors />
            </ProtectedRoute>
          }
        />
                        <Route
          path="/authors/:id"
          element={
            <ProtectedRoute>
              <AuthorDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:id"
          element={
            <ProtectedRoute>
              <BookDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/authors"
          element={
            <ProtectedRoute>
              <Authors />
            </ProtectedRoute>
          }
        />

        {/* 👤 Member-only Routes */}
        <Route
          path="/borrow"
          element={
            <MemberRoute>
              <BorrowBook />
            </MemberRoute>
          }
        />
        <Route
          path="/my-borrowings"
          element={
            <MemberRoute>
              <MyBorrowings />
            </MemberRoute>
          }
        />
      </Route>

      {/* 🛠️ Admin-only Routes without Layout */}
      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <DashboardLayout />
          </AdminRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="borrowed-books" element={<BorrowedBooks />} />
        <Route path="authors" element={<AllAuthors />} />
        <Route path="users" element={<AllUsers />} />
        <Route path="add-book" element={<AddBook />} />
        <Route path="all-books" element={<AllBooks/>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
