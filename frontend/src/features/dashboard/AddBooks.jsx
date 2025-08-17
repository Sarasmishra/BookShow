// src/pages/Admin/AddBook.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddBook = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [authors, setAuthors] = useState([]);
  const [formData, setFormData] = useState({
    title: 'The Future Engineer',
    ISBN: '9876543210',
    summary: 'A journey through modern software architecture.',
    publicationDate: '2024-01-10',
    genres: 'Tech, Career',
    copiesAvailable: 5,
    authorId: '',
  });

  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/authors/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthors(res.data);
      } catch (err) {
        toast.error('Failed to load authors',{ autoClose: 1000});
      }
    };

    fetchAuthors();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'copiesAvailable' ? parseInt(value) : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.authorId || !coverImage) {
      return toast.warning('Please fill all required fields including image!',{ autoClose: 1000});
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });
    form.append('coverImage', coverImage); // must match backend's multer field

    try {
      const res = await axios.post('http://localhost:5000/api/books', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(res.data.message || 'Book added!',{ autoClose: 1000});
      navigate('/books');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to add book',{ autoClose: 1000});
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">➕ Add New Book</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="block font-medium">ISBN</label>
          <input
            type="text"
            name="ISBN"
            value={formData.ISBN}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="block font-medium">Summary</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Publication Date</label>
            <input
              type="date"
              name="publicationDate"
              value={formData.publicationDate}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="block font-medium">Copies Available</label>
            <input
              type="number"
              name="copiesAvailable"
              value={formData.copiesAvailable}
              onChange={handleChange}
              className="input input-bordered w-full"
              min="1"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Genres (comma separated)</label>
          <input
            type="text"
            name="genres"
            value={formData.genres}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="block font-medium">Select Author</label>
          <select
            name="authorId"
            value={formData.authorId}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="">-- Choose Author --</option>
            {authors.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Upload Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-2 h-48 w-auto rounded border"
            />
          )}
        </div>

        <button
          type="submit"
          className="btn bg-blue-600 text-white hover:bg-blue-700"
        >
          📚 Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;
