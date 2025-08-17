import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
const Layout = () => {
    return (
        <>
<Navbar/>
<div className=' min-h-[80vh]'>
<Outlet/>
</div>
<Footer/>


</>
    );
};

export default Layout;