import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Main = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${BASE_URL}/api/books`, {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem('token')}`,
          },
        });
        setBooks(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch books.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [token]);

  const handleBorrow = async (bookId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}}/api/borrow`,
        { bookId, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }, // 7 days from now
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem('token')}`,
          },
        }
      );
      alert(res.data.message);
      // Refresh book list after borrowing
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === bookId
            ? { ...book, copiesAvailable: book.copiesAvailable - 1 }
            : book
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to borrow book.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-2xl font-semibold text-center mb-8">
        👋 Welcome, {user?.name || 'Member'}
      </h1>

      {loading ? (
        <p className="text-center">Loading books...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-lg font-bold mb-2">{book.title}</h2>
              <p className="text-sm mb-1">
                <strong>Author:</strong> {book.author?.name || 'Unknown'}
              </p>
              <p className="text-sm mb-1">
                <strong>Genre:</strong>{' '}
                {book.genres?.length ? book.genres.join(', ') : 'N/A'}
              </p>
              <p className="text-sm mb-2">
                <strong>Available:</strong> {book.copiesAvailable}
              </p>

              <button
                onClick={() => handleBorrow(book._id)}
                disabled={book.copiesAvailable <= 0}
                className={`w-full mt-2 py-2 text-white rounded ${
                  book.copiesAvailable > 0
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {book.copiesAvailable > 0 ? 'Borrow Book' : 'Not Available'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Main;
