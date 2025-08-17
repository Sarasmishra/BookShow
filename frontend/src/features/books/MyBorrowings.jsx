// src/pages/Member/MyBorrowings.jsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { fetchMyBorrowings, returnBook } from "../../Redux/borrowing/BorrwingSlice";

const MyBorrowings = () => {
  const dispatch = useDispatch();
  const { myBorrowings, loading } = useSelector((state) => state.borrowing);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(fetchMyBorrowings(token));
    }
  }, [dispatch, token]);

  const handleReturnBook = async (transactionId) => {
    try {
      await dispatch(returnBook({ transactionId, token })).unwrap();
      toast.success("Book returned successfully!",{ autoClose: 1000});
    } catch (err) {
      toast.error("Failed to return book",{ autoClose: 1000});
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">My Borrowed Books</h2>

      {myBorrowings.length === 0 ? (
        <p>No borrowed books found.</p>
      ) : (
        <div>
          {myBorrowings.map((borrowing) => (
            <motion.div
              key={borrowing._id}
              className="bg-white shadow-lg rounded-lg p-6 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{borrowing.book.title}</h3>
                <p className="text-gray-500">
                  Due: {new Date(borrowing.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  Borrowed on:{" "}
                  {new Date(borrowing.borrowDate).toLocaleDateString()}
                </p>
                {borrowing.status !== "Returned" ? (
                  <button
                    onClick={() => handleReturnBook(borrowing._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                  >
                    Return Book
                  </button>
                ) : (
                  <span className="text-green-500">Returned</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBorrowings;
