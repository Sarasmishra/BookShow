// src/pages/Admin/AllBooks.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllBooksRaw,
  updateBookById,
  deleteBookById,
} from "../../Redux/book/BookSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const AllBooks = () => {
  const dispatch = useDispatch();
  const { books, loading } = useSelector((state) => state.book);
  const { token } = useSelector((state) => state.auth);

  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");
  const [editForm, setEditForm] = useState({
    title: "",
    genres: "",
    copiesAvailable: "",
    description: "",
  });

  useEffect(() => {
    if (token) dispatch(fetchAllBooksRaw(token));
  }, [dispatch, token]);

  const filteredBooks = books
    .filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortType === "title-asc") return a.title.localeCompare(b.title);
      if (sortType === "title-desc") return b.title.localeCompare(a.title);
      if (sortType === "latest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  const handleEdit = (book) => {
    setEditId(book._id);
    setEditForm({
      title: book.title,
      genres: book.genres?.join(", ") || "",
      copiesAvailable: book.copiesAvailable || 1,
      description: book.description || "",
    });
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        ...editForm,
        genres: editForm.genres.split(",").map((g) => g.trim()),
      };
      await dispatch(updateBookById({ id: editId, updatedData, token })).unwrap();
      toast.success("Book updated!");
      setEditId(null);
    } catch (err) {
      toast.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await dispatch(deleteBookById({ id, token })).unwrap();
        toast.success("Book deleted!");
      } catch (err) {
        toast.error(err);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-6">📘 All Books (Admin)</h2>

      {/* 🔍 Search + Sort */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-1/2"
        />

        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Sort</option>
          <option value="title-asc">Title (A–Z)</option>
          <option value="title-desc">Title (Z–A)</option>
          <option value="latest">Latest</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center text-lg">Loading books...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book, i) => (
            <motion.div
              key={book._id}
              className="bg-white shadow rounded p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {/* 📸 Image */}
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-40 w-full object-cover rounded mb-3"
                />
              ) : (
                <div className="h-40 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              {editId === book._id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Title"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Genres (comma separated)"
                    value={editForm.genres}
                    onChange={(e) =>
                      setEditForm({ ...editForm, genres: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Copies Available"
                    value={editForm.copiesAvailable}
                    onChange={(e) =>
                      setEditForm({ ...editForm, copiesAvailable: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                  <textarea
                    placeholder="Description"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleUpdate}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold">{book.title}</h3>
                  <p className="text-sm">Genres: {book.genres?.join(", ")}</p>
                  <p className="text-sm text-gray-600">
                    Available: {book.copiesAvailable}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {book.description || "No description"}
                  </p>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(book)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBooks;
