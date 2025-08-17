import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Modal from 'react-modal';
import Spinner from '../../components/common/Spinner';

Modal.setAppElement('#root'); // For accessibility

const AllUsers = () => {
  const { token, isLoading } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchUsers = async () => {
    if (!token) {
      toast.error("Unauthorized access - No token", { autoClose: 1000 });
      return;
    }
    try {
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to fetch users', { autoClose: 1000 });
    }
  };

  useEffect(() => {
    if (!isLoading && token) {
      fetchUsers();
    }
  }, [isLoading, token]);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('User deleted', { autoClose: 1000 });
      setShowModal(false);
      setDeleteId(null);
      fetchUsers();
    } catch (err) {
      toast.error('Delete failed', { autoClose: 1000 });
      setShowModal(false);
    }
  };

if(isLoading) return <Spinner/>
 

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        👥 All Users
      </h2>

      

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Gender</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.gender || '—'}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2 space-x-2">

                  <button onClick={() => handleDeleteClick(user._id)} className="bg-red-600 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto mt-32 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <h2 className="text-lg font-bold text-red-600 mb-4">Confirm Deletion</h2>
        <p className="mb-6 text-gray-700">Are you sure you want to delete this user?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={confirmDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
          >
            Delete
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded font-semibold"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default AllUsers;
