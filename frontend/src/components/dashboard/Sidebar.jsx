import React from 'react';
import { NavLink } from 'react-router-dom';


const Sidebar = () => {
  const linkStyle = 'block mb-4 p-2 rounded hover:bg-blue-700';
  const activeStyle = 'bg-blue-700';

  return (
    <>

    <div>
      <h2 className="text-2xl font-bold mb-8">📊 Dashboard</h2>
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `${linkStyle} ${isActive ? activeStyle : ''}`
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/dashboard/borrowed-books"
        className={({ isActive }) =>
          `${linkStyle} ${isActive ? activeStyle : ''}`
        }
      >
        Borrowed Books
      </NavLink>
      <NavLink
        to="/dashboard/Authors"
        className={({ isActive }) =>
          `${linkStyle} ${isActive ? activeStyle : ''}`
        }
      >
        Authors
      </NavLink>
      <NavLink
        to="/dashboard/users"
        className={({ isActive }) =>
          `${linkStyle} ${isActive ? activeStyle : ''}`
        }
      >
        Users
      </NavLink>
      <NavLink
        to="/dashboard/all-books"
        className={({ isActive }) =>
          `${linkStyle} ${isActive ? activeStyle : ''}`
        }
      >
        Books
      </NavLink>
      <NavLink
        to="/dashboard/add-book"
        className={({ isActive }) =>
          `${linkStyle} ${isActive ? activeStyle : ''}`
        }
      >
        AddBook
      </NavLink>

    </div>
</>
  );
};

export default Sidebar;
