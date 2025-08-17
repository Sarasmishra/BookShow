import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
const BASE_URL = import.meta.env.VITE_BASE_URL;
const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Profile fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [favoriteGenre, setFavoriteGenre] = useState('');
  const [role, setRole] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);



  const userId = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/users/${userId._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const user = response.data;
        setUser(user);
        setName(user.name || '');
        setEmail(user.email || '');
        setPhoneNumber(user.phoneNumber || '');
        setDob(user.dob ? user.dob.split('T')[0] : '');
        setAddress(user.address || '');
        setBio(user.bio || '');
        setFavoriteGenre(user.favoriteGenre || '');
        setRole(user.role || '');
        setAvatarPreview(user.avatar || '');
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phoneNumber', phoneNumber);
      formData.append('dob', dob);
      formData.append('address', address);
      formData.append('bio', bio);
      formData.append('favoriteGenre', favoriteGenre);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await axios.put(
        `${BASE_URL}/api/users/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success('Profile updated successfully!');
      setUser(res.data.user);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center mt-10 text-xl">Loading profile...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-100 py-10 px-4 md:px-20"
    >
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-lg p-10">
        <div className="flex flex-col md:flex-row md:space-x-10">
          <div className="flex-shrink-0 text-center">
            <img
              src={avatarPreview || '/default-avatar.png'}
              alt="Avatar"
              className="w-48 h-48 object-cover rounded-full border-4 border-blue-600 mx-auto"
            />
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="mt-4 text-sm text-gray-600"
              />
            )}
            {!isEditing && (
              <p className="mt-2 text-blue-600 font-semibold">{role}</p>
            )}
          </div>

          <div className="flex-grow mt-8 md:mt-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">User Profile</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                ) : (
                  <p className="text-gray-800">{name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                <p className="text-gray-800">{email}</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Phone Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                ) : (
                  <p className="text-gray-800">{phoneNumber}</p>
                )}
              </div>

              {/* DOB */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                ) : (
                  <p className="text-gray-800">{dob}</p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Address</label>
                {isEditing ? (
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  ></textarea>
                ) : (
                  <p className="text-gray-800">{address}</p>
                )}
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Bio</label>
                {isEditing ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  ></textarea>
                ) : (
                  <p className="text-gray-800">{bio}</p>
                )}
              </div>

              {/* Favorite Genre */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Favorite Genre</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={favoriteGenre}
                    onChange={(e) => setFavoriteGenre(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                ) : (
                  <p className="text-gray-800">{favoriteGenre}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
