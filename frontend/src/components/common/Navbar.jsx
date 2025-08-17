import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {logout} from '../../Redux/auth/AuthSlice'
import { toast } from "react-toastify";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logout successfully",{ autoClose: 1000})
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">
        BookShow
      </Link>

      {isAuthenticated ? (
        <div className="flex items-center gap-4">
            <Link to="/books" className="hover:underline">
            Books
          </Link>
          <Link to="/profile" className="hover:underline">
            Profile
          </Link>
          <Link to="/authors" className="hover:underline">
            Authors
          </Link>

          {user?.role === 'member' && (
          <Link to="/my-borrowings" className="hover:underline">
          My-Borrowings
        </Link>
    )}
 {/* ✅ Only show dashboard if user is admin */}
 {user?.role === 'admin' && (
      <Link to="/dashboard" className="hover:underline">
        Dashboard
      </Link>
    )}
          <span>👋 Welcome, {user?.name || "User"}</span>
          {user?.avatar && (
      <img
        src={user.avatar}
        alt="User Avatar"
        className="w-10 h-10 rounded-full object-cover border-2 border-white"
      />
    )}
    
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="space-x-4">
          <Link to="/login" className="hover:underline">
            Login
          </Link>
          <Link to="/register" className="hover:underline">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
