import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../common/Navbar';

const DashboardLayout = () => {
  return (
    <>
    <Navbar/>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen grid grid-cols-12"
    >
      {/* Sidebar 1/3 */}
      <div className="col-span-12 md:col-span-4 bg-blue-600 text-white p-6">
        <Sidebar />
      </div>

      {/* Main Content 2/3 */}
      <motion.div
        className="col-span-12 md:col-span-8 bg-gray-50 p-6"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Outlet />
      </motion.div>
    </motion.div>
    </>
  );
};

export default DashboardLayout;
