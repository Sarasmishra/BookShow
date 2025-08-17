import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const AuthorDetails = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/authors/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthor(res.data);
      } catch (err) {
        setError('Author not found');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [id, token]);

  if (loading) return <p className="text-center mt-10">Loading author details...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <motion.h2
        className="text-3xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        👨‍🏫 {author.name}
      </motion.h2>

      <p className="text-gray-700 text-sm mb-2">
        <strong>Nationality:</strong> {author.nationality}
      </p>
      <p className="text-gray-700 text-sm mb-2">
        <strong>Date of Birth:</strong> {author.dateOfBirth?.split('T')[0]}
      </p>
      <p className="text-gray-800 mb-4">{author.biography}</p>

      <h4 className="font-semibold text-lg mb-2">📚 Books by {author.name}</h4>
      <ul className="list-disc ml-6 space-y-1 text-blue-700">
        {author.books?.map((book) => (
          <li key={book._id}>
            <Link to={`/books/${book._id}`} className="hover:underline">
              {book.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuthorDetails;
