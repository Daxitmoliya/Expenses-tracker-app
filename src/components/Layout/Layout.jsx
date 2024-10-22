import React from 'react';
import { Link } from 'react-router-dom';


const Layout = ({ children }) => {
  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-logo">
          My Expenses
        </div>
        <ul className="sidebar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/expenses" className="nav-link">Expenses</Link>
          </li>
          <li className="nav-item">
            <Link to="/users" className="nav-link">Users</Link>
          </li>
          
        </ul>
      </nav>
      <div className="content">
        {children}
      </div>
    </div>
  );
}

export default Layout;
