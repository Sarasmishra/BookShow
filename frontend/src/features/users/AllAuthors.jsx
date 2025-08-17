import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  fetchAllAuthors,
  updateAuthor,
  deleteAuthor,
  createAuthor,
} from '../../Redux/author/AuthorSlice';

const AllAuthors = () => {
  const dispatch = useDispatch();

  const token = localStorage.getItem('token')
  const { authors, loading } = useSelector((state) => state.author);

  const [form, setForm] = useState({ name: '', biography: '', dateOfBirth: '', nationality: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {

    dispatch(fetchAllAuthors(token));
  }, [dispatch, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.biography || !form.dateOfBirth || !form.nationality) {
      toast.warn('All fields required');
      return;
    }

    const payload = { formData: form, token };

    console.log(form)
    try {
      if (editId) {
        await dispatch(updateAuthor({ id: editId, ...payload })).unwrap();
        toast.success('Author updated');
      } else {
        await dispatch(createAuthor(payload)).unwrap();
        toast.success('Author created');
      }
      setForm({ name: '', biography: '', dateOfBirth: '', nationality: '' });
      setEditId(null);
    } catch (err) {
      toast.error(err);
    }
  };

  const handleEdit = (author) => {
    setEditId(author._id);
    setForm({
      name: author.name,
      biography: author.biography,
      dateOfBirth: author.dateOfBirth?.slice(0, 10),
      nationality: author.nationality,
    });
    // console.log({ editId, form }); 

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete?')) return;
    try {
      await dispatch(deleteAuthor({ id, token })).unwrap();
      toast.success('Author deleted');
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        {editId ? '✏️ Edit Author' : '📚 Add New Author'}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow mb-6"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="biography"
          placeholder="Biography"
          value={form.biography}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="nationality"
          placeholder="Nationality"
          value={form.nationality}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 col-span-full"
        >
          {editId ? 'Update Author' : 'Create Author'}
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">📖 All Authors</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Nationality</th>
              <th className="p-2 text-left">DOB</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author) => (
              <tr key={author._id} className="border-t">
                <td className="p-2">{author.name}</td>
                <td className="p-2">{author.nationality}</td>
                <td className="p-2">{new Date(author.dateOfBirth).toLocaleDateString()}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(author)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(author._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AllAuthors;
