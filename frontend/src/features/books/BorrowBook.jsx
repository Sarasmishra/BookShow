import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const BorrowBook = () => {
  const { token } = useSelector((state) => state.auth);
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ bookId: '', dueDate: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/books', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const available = res.data.filter((book) => book.copiesAvailable > 0);
        setBooks(available);
      } catch (error) {
        console.log('Failed to fetch books:', error);
      }
    };

    fetchBooks();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/borrow',
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(res.data.message || 'Book borrowed successfully!');
      setForm({ bookId: '', dueDate: '' }); // reset form
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to borrow book');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-semibold mb-4">📥 Borrow a Book</h2>

      {message && (
        <div className="mb-4 text-sm text-blue-700 bg-blue-100 p-2 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Select Book</label>
          <select
            name="bookId"
            value={form.bookId}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Choose a Book --</option>
            {books.map((book) => (
              <option key={book._id} value={book._id}>
                {book.title} ({book.copiesAvailable} copies)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Borrow Request
        </button>
      </form>
    </div>
  );
};

export default BorrowBook;
