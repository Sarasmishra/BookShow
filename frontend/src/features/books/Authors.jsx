import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthors } from '../../Redux/author/AuthorSlice';
import { motion } from 'framer-motion';
import debounce from 'lodash.debounce';
import { Link, useNavigate } from 'react-router-dom';

const Authors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const { authors, totalPages = 1, loading } = useSelector((state) => state.author);

  const [filters, setFilters] = useState({
    name: '',
    nationality: '',
    sort: '',
  });

  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const limit = 6;

  const debounceSearch = useCallback(
    debounce((query) => {
      setFilters((prev) => ({ ...prev, name: query }));
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
    setFilters({ name: '', nationality: '', sort: '' });
    setSearchText('');
    setPage(1);
  };

  useEffect(() => {
    if (token) {
      dispatch(fetchAuthors({ token, filters: { ...filters, page, limit } }));
    }
  }, [filters.name, filters.nationality, filters.sort, page, token, dispatch]);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">🧑‍🏫 Authors</h2>

      {/* Filters */}
      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchText}
          onChange={handleSearchChange}
          className="px-3 py-2 border rounded col-span-2"
        />

        <input
          type="text"
          placeholder="Nationality"
          name="nationality"
          value={filters.nationality}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded"
        />

        <select
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded"
        >
          <option value="">Sort</option>
          <option value="name">Name (A-Z)</option>
          <option value="latest">Recently Added</option>
        </select>
      </div>

      <button
        onClick={handleClearFilters}
        className="mb-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Clear Filters
      </button>

      {/* Authors List */}
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {authors.map((author, index) => (
            <motion.div
              key={author._id}
              onClick={() => navigate(`/authors/${author._id}`)}
              className="bg-white p-4 rounded-xl shadow-md cursor-pointer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-xl font-semibold">{author.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{author.nationality}</p>
              <p className="text-gray-800 text-sm mb-3">
                📅 Born: {author.dateOfBirth?.split('T')[0]}
              </p>
              <p className="text-gray-700 mb-3 text-sm">{author.biography}</p>

              <h4 className="font-semibold mt-4 text-sm">📚 Books:</h4>
              <ul className="list-disc ml-4 text-sm text-blue-700">
                {author.books?.map((book) => (
                  <li key={book._id}>
                    <Link
                      to={`/books/${book._id}`}
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {book.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
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
        <span className="self-center font-medium">
          Page {page} of {totalPages}
        </span>
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

export default Authors;
