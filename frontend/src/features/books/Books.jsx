import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import debounce from 'lodash.debounce';
import { fetchBooks } from '../../Redux/book/BookSlice';
import { fetchAuthors } from '../../Redux/author/AuthorSlice';

const Books = () => {
  const dispatch = useDispatch();
  // const { token } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token')
  const { books, totalPages, loading } = useSelector((state) => state.book);


  const [authors, setAuthors] = useState([]);

  const [filters, setFilters] = useState({
    genre: '',
    author: '',
    title: '',
    sort: ''
  });

  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const limit = 6;

  // 🔁 Fetch authors
  // const fetchAuthors = async () => {
  //   try {
  //     const res = await fetch('http://localhost:5000/api/authors/all', {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const data = await res.json();
  //     setAuthors(data);
  //   } catch (err) {
  //     console.error('Failed to fetch authors', err);
  //   }
  // };

  const loadBooks = () => {
    dispatch(fetchBooks({ token, filters: { ...filters, page, limit } }));
  };

  const debounceSearch = useCallback(
    debounce((query) => {
      setFilters((prev) => ({ ...prev, title: query }));
      setPage(1);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    debounceSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ genre: '', author: '', title: '', sort: '' });
    setSearchText('');
    setPage(1);
  };

  useEffect(() => {
        if (token) {
          dispatch(fetchAuthors({ token, filters: { ...filters, page, limit } }));
        }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadBooks();
    }
  }, [filters, page, token]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📚 Browse Books</h2>

      {/* Filters */}
      <div className="grid md:grid-cols-5 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title"
          value={searchText}
          onChange={handleSearchChange}
          className="px-3 py-2 border rounded col-span-2"
        />

        <select name="genre" value={filters.genre} onChange={handleFilterChange} className="px-3 py-2 border rounded">
          <option value="">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Romance">Romance</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Biography">Biography</option>
        </select>

        <select name="author" value={filters.author} onChange={handleFilterChange} className="px-3 py-2 border rounded">
          <option value="">All Authors</option>
          {authors.map((a) => (
            <option key={a._id} value={a._id}>
              {a.name}
            </option>
          ))}
        </select>

        <select name="sort" value={filters.sort} onChange={handleFilterChange} className="px-3 py-2 border rounded">
          <option value="">Sort</option>
          <option value="latest">Latest</option>
          <option value="title">Title (A-Z)</option>
        </select>
      </div>

      <button onClick={handleClearFilters} className="mb-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
        Clear Filters
      </button>

      {/* Books Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="h-40 bg-gray-200 rounded animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {books.map((book) => (
            <Link to={`/books/${book._id}`} key={book._id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white p-4 rounded shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-600">by {book.author?.name}</p>
                <p className="text-sm">Genres: {book.genres.join(', ') || 'N/A'}</p>
                <p className="text-sm text-green-600 mt-2">
                  {book.copiesAvailable} copies available
                </p>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          ◀ Prev
        </button>
        <span className="self-center font-medium">Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default Books;
