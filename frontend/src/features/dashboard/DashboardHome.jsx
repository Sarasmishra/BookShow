import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchAllUsers } from "../../Redux/user/userSlice";
import { fetchAllBooksRaw } from "../../Redux/book/BookSlice";
import { getAllBorrowings } from "../../Redux/borrowing/BorrwingSlice";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const DashboardHome = () => {
  const dispatch = useDispatch();
  // const { token } = useSelector((state) => state.auth);
const token = localStorage.getItem('token')
  const users = useSelector((state) => state.user.users);
  const books = useSelector((state) => state.book.books);
  const transactions = useSelector((state) => state.borrowing.myBorrowings);

  const { loading: userLoading } = useSelector((state) => state.user);
  const { loading: bookLoading } = useSelector((state) => state.book);
  const { loading: borrowingLoading } = useSelector((state) => state.borrowing);
  
  // Combine loading states
  const loading = userLoading || bookLoading || borrowingLoading;

  const [stats, setStats] = useState({ users: 0, books: 0, transactions: 0 });
  const [topUsers, setTopUsers] = useState([]);
  const [recentBorrowed, setRecentBorrowed] = useState([]);

  useEffect(() => {

    if (token) {
      dispatch(fetchAllUsers(token));
      dispatch(fetchAllBooksRaw(token));
      dispatch(getAllBorrowings(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (users.length > 0 && books.length > 0 && transactions.length > 0) {
      const recent = [...transactions]
        .sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate))
        .slice(0, 5)
        .map((t) => ({
          title: t.book?.title,
          user: t.member?.name,
          date: t.borrowDate?.split("T")[0],
        }));

      const userMap = {};
      transactions.forEach((t) => {
        const userId = t.member?._id;
        if (!userMap[userId]) {
          userMap[userId] = { name: t.member?.name, count: 0 };
        }
        userMap[userId].count += 1;
      });

      const top = Object.values(userMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      setStats({
        users: users.length,
        books: books.length,
        transactions: transactions.length,
      });
      setTopUsers(top);
      setRecentBorrowed(recent);
    }
  }, [users, books, transactions]);

  const cardData = [
    { title: 'Total Users', value: stats.users, color: 'bg-blue-100', emoji: '👥' },
    { title: 'Total Books', value: stats.books, color: 'bg-green-100', emoji: '📚' },
    { title: 'Total Borrowed', value: stats.transactions, color: 'bg-yellow-100', emoji: '🔄' },
  ];

  return (
    <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
      <h1 className="text-3xl font-bold text-blue-700 mb-6">📊 Dashboard Overview</h1>

      {loading ? (
        <p className="text-gray-500">Loading stats...</p>
      ) : (
        <>
          {/* 💠 Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {cardData.map((card, i) => (
              <motion.div
                key={i}
                className={`${card.color} rounded-xl shadow p-6 text-center`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="text-4xl mb-2">{card.emoji}</div>
                <h3 className="text-lg text-gray-700 font-semibold">{card.title}</h3>
                <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
              </motion.div>
            ))}
          </div>

          {/* 📈 Charts */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {recentBorrowed.length > 0 && (
              <div className="bg-white rounded shadow p-4">
                <h3 className="text-xl font-bold mb-2">Borrow Trends</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={recentBorrowed}>
                    <defs>
                      <linearGradient id="colorBorrow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="title" stroke="#3B82F6" fillOpacity={1} fill="url(#colorBorrow)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {topUsers.length > 0 && (
              <div className="bg-white rounded shadow p-4">
                <h3 className="text-xl font-bold mb-2">Top Borrowers</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={topUsers}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#34D399" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* 🕵️ Recent Borrowed Table */}
          {recentBorrowed.length > 0 && (
            <div className="bg-white rounded shadow p-4">
              <h3 className="text-xl font-bold mb-4">Recent Borrowed Books</h3>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="py-2 px-4">Book</th>
                    <th className="py-2 px-4">User</th>
                    <th className="py-2 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBorrowed.map((r, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{r.title}</td>
                      <td className="py-2 px-4">{r.user}</td>
                      <td className="py-2 px-4">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default DashboardHome;
