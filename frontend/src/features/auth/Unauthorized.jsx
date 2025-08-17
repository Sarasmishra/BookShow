import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Unauthorized = () => {
  useEffect(() => {
    toast.error("Unauthorized");
  }, []);

  return (
    <div className="h-screen flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-4xl font-bold text-red-600 mb-4">🚫 Access Denied</h1>
        <p className="text-gray-600">You don’t have permission to view this page.</p>
        
        <Link to='/'>
          <button className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition duration-200">
            Go to Home Page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
