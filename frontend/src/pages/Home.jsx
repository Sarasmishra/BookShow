import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' }
  })
};

const Home = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-6">
      {/* HERO */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
          Welcome to BookShow 📚
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-xl mx-auto">
          A full-stack library management platform for borrowing, tracking, and managing books.
        </p>
      </motion.section>

      {/* WHAT IS IT */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
        className="text-center mb-16"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          What is BookShow?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          BookShow is a MERN-based web app where admins manage books and users, while members can browse, borrow, and return books — all in real-time. Designed for scalability and clean UI, it's ready for production-level use.
        </p>
      </motion.section>

      {/* FEATURES */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
        className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-20"
      >
        {[
          {
            title: '🔐 User Authentication',
            desc: 'Role-based login with member/admin access.'
          },
          {
            title: '📚 Borrow Books',
            desc: 'Members can borrow available books instantly.'
          },
          {
            title: '🛠 Admin Tools',
            desc: 'Manage users, books, and transactions easily.'
          },
          {
            title: '📊 Dashboard',
            desc: 'Track your borrowed books and activity log.'
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-xl shadow p-6"
            custom={i + 4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <h3 className="font-bold text-blue-600 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* CTA */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={8}
        className="text-center"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Ready to explore?</h2>

        {
          isAuthenticated ?(
            <div className="flex justify-center gap-4">
            <Link
              to="/books"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Books
            </Link>
            </div>
          )  : (
            <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50"
            >
              Login
            </Link>
          </div>
          ) 
        }

      </motion.section>
    </div>
  );
};

export default Home;
