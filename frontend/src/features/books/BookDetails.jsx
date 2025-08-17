// BookDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookById, submitReview } from '../../Redux/book/BookSlice';
import { fetchMyBorrowings, borrowBook } from '../../Redux/borrowing/BorrwingSlice';
import { toast } from 'react-toastify';
import StarRatings from "react-star-ratings";
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


const BookDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const { user } = useSelector((state) => state.auth);
  const { selectedBook: book, loading } = useSelector((state) => state.book);
  const { myBorrowings } = useSelector((state) => state.borrowing);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showBadge, setShowBadge] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(true);

  useEffect(() => {
    if (id && token) {
      dispatch(fetchBookById({ id, token }));
      if (user.role === 'member') dispatch(fetchMyBorrowings(token));
    }
  }, [id, token]);

  useEffect(() => {
    if (book) {
 setSkeletonLoading(false)
      const timer = setTimeout(() => {

        setShowBadge(true);
      }, 400); // 2 seconds delay
      return () => clearTimeout(timer);
    }
  }, [book]);
  

  const isBorrowed = myBorrowings?.some(
    (t) => t.book?._id === id && t.status === 'Borrowed'
  );

  const hasReviewed = book?.reviews?.some((r) => r.user === user._id);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.warn("Please add a rating", { autoClose: 1000 });
    try {
      await dispatch(submitReview({ id, token, rating, comment })).unwrap();
      toast.success("Review submitted", { autoClose: 1000 });
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err);
    }
  };

  const handleBorrow = async () => {
    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      await dispatch(borrowBook({ bookId: id, dueDate, token })).unwrap();
      toast.success('Book borrowed!', { autoClose: 1000 });
      dispatch(fetchMyBorrowings(token));
    } catch (err) {
      console.error(err);
      toast.error(err || 'Borrow failed', { autoClose: 1000 });
    }
  };




  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="p-6 max-w-5xl mx-auto"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative">
          {skeletonLoading ? (
            <Skeleton height={250} width={180} />
          ) : (
            <img
              src={book?.coverImage || 'https://dhmckee.com/wp-content/uploads/2018/11/defbookcover-min.jpg'}
              alt="Cover"
              className="w-48 h-64 object-cover border rounded shadow"
            />
          )}
          {isBorrowed && showBadge && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="absolute top-0 left-0 bg-green-500 text-white px-2 py-1 text-xs rounded-br-lg"
            >
              📖 Borrowed
            </motion.div>
          )}
        </div>

        <div className="flex-1 space-y-3">
          {skeletonLoading ? (
            <>
              <Skeleton width="60%" height={30} />
              <Skeleton width="40%" />
              <Skeleton width="80%" />
              <Skeleton width="70%" />
              <Skeleton count={2} />
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold">{book?.title}</h2>
              <p>👤 Author: <span className="font-medium">{book?.author?.name}</span></p>
              <p>📚 Genres: {book?.genres?.join(', ')}</p>
              <p>📦 Copies Available: {book?.copiesAvailable}</p>
              <p className="text-gray-700">📝 {book?.description || 'No description available.'}</p>

              {book?.averageRating > 0 && (
                <div className="mt-2">
                  <StarRatings
                    rating={book?.averageRating}
                    starRatedColor="gold"
                    numberOfStars={5}
                    starDimension="22px"
                    name="avg"
                  />
                  <p className="text-sm text-gray-500">{book?.reviews?.length} review(s)</p>
                </div>
              )}

              {user.role === 'member' && (
                isBorrowed ? (
                  <button disabled className="bg-gray-400 text-white px-4 py-2 rounded mt-2">✅ Already Borrowed</button>
                ) : (
                  <button onClick={handleBorrow} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2">📚 Borrow</button>
                )
              )}
            </>
          )}
        </div>
      </div>

      {/* Review Form */}
      {user.role === 'member' && !hasReviewed && !skeletonLoading && (
        <motion.form
          onSubmit={handleReviewSubmit}
          className="mt-8 bg-white p-4 rounded-lg shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h3 className="text-xl font-semibold mb-2">Leave a Review</h3>
          <StarRatings
            rating={rating}
            starRatedColor="gold"
            changeRating={setRating}
            numberOfStars={5}
            name="rating"
            starDimension="28px"
          />
          <textarea
            rows={3}
            className="w-full mt-3 border rounded p-2"
            placeholder="Optional comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit" className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Submit
          </button>
        </motion.form>
      )}

      {/* User Reviews */}
      {!skeletonLoading && book?.reviews?.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4">User Reviews</h3>
          <div className="space-y-4">
            {book?.reviews.map((rev) => (
              <motion.div
                key={rev._id}
                className="border p-4 rounded-lg shadow-sm bg-gray-50"
                whileHover={{ scale: 1.02 }}
              >
                <p className="font-semibold">{rev.name}</p>
                <StarRatings
                  rating={rev.rating}
                  starRatedColor="gold"
                  numberOfStars={5}
                  name="rev"
                  starDimension="18px"
                />
                <p className="text-gray-700">{rev.comment}</p>
                <p className="text-xs text-gray-500">{new Date(rev.createdAt).toLocaleDateString()}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BookDetails;



      // {/* 🔐 Hide borrow for admins */}
      // {user.role !== 'admin' && (
      //   isBorrowed ? (
      //     <button className="px-4 py-2 bg-gray-400 text-white rounded" disabled>
      //       ✅ Already Borrowed
      //     </button>
      //   ) : (
      //     <button
      //       onClick={handleBorrow}
      //       className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      //     >
      //       📚 Borrow this Book
      //     </button>
      //   )
      // )}
      
  // const handleBorrow = async () => {
  //   try {
  //     const dueDate = new Date();
  //     dueDate.setDate(dueDate.getDate() + 14);

  //     await axios.post(
  //       'http://localhost:5000/api/borrow',
  //       { bookId: id, dueDate },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     toast.success('Book borrowed!',{ autoClose: 1000})
  //     setIsBorrowed(true);
  //   } catch (err) {
  //     console.error(err);
  //   toast.error('Borrow failed',{ autoClose: 1000})
  //   }
  // };
