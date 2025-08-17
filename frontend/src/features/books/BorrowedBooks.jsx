import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBorrowings, returnBook } from '../../Redux/borrowing/BorrwingSlice'; // adjust import path if needed
import { toast } from 'react-toastify';

const BorrowedBooks = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { myBorrowings, loading } = useSelector((state) => state.borrowing);

  useEffect(() => {
    if (token) {
      dispatch(getAllBorrowings(token));
    }
  }, [token, dispatch]);

  const handleReturn = (id) => {
    dispatch(returnBook({ transactionId: id, token }));
    toast.success("Book returned",{ autoClose: 1000})
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">📋 All Borrowed Books</h2>

      {loading ? (
        <p>Loading...</p>
      ) : myBorrowings.length === 0 ? (
        <p>No borrowings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left">Book</th>
                <th className="p-2 text-left">Member</th>
                <th className="p-2 text-left">Borrow Date</th>
                <th className="p-2 text-left">Due Date</th>
                <th className="p-2 text-left">Return Date</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {myBorrowings.map((tx) => (
                <tr key={tx._id} className="border-t">
                  <td className="p-2">{tx.book?.title || 'N/A'}</td>
                  <td className="p-2">{tx.member?.name || 'N/A'}</td>
                  <td className="p-2">{new Date(tx.borrowDate).toLocaleDateString()}</td>
                  <td className="p-2">{new Date(tx.dueDate).toLocaleDateString()}</td>
                  <td className="p-2">
                    {tx.returnDate ? new Date(tx.returnDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        tx.status === 'Borrowed'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-2">
                    {tx.status === 'Borrowed' && (
                      <button
                        onClick={() => handleReturn(tx._id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BorrowedBooks;
