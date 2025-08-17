import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Spinner from '../components/common/Spinner'

const MemberRoute = ({ children }) => {
  const { isAuthenticated, user,isLoading } = useSelector((state) => state.auth);

  if (isLoading) return <Spinner />;

  if (!isAuthenticated || user.role !== 'member') {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default MemberRoute;
