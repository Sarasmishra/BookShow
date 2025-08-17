import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getUserProfile } from './Redux/auth/AuthSlice';

import AppRoutes from './Routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const dispatch = useDispatch();


  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user?._id) {
      dispatch(getUserProfile({ token, id: user._id }));
    }
  }, [dispatch]);

  return (
    <>
    <ToastContainer   position="top-right"
    autoClose={3000} 
    hideProgressBar={false} 
    newestOnTop={true} 
    closeButton={false} 
    rtl={false} />
                <AppRoutes />
</>


  )
}

export default App