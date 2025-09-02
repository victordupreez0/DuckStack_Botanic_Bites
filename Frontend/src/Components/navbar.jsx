import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-black bg-opacity-70 px-5">
      <div className="navbar justify-center shadow-sm">
        {/* Left side - menu */}
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li>
                <Link to="/">Homepage</Link>
              </li>
              <li>
                <Link to="/portfolio">Portfolio</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Center - logo */}
        <div className="navbar-center w-10">
          <img src={Logo} className="invert" alt="Logo" />
        </div>

        {/* Right side - login link */}
        <div className="navbar-end flex-none">
          <Link to="/signUp" className="btn btn-primary ml-2">Sign up</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;