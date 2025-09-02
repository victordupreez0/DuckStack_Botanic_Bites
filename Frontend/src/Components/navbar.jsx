import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';

function Navbar() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
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
                <Link to="/care">Care Guides</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/shop">Shop</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Center - logo */}
        <div className="navbar-center w-10">
          <img src={Logo} className="invert" alt="Logo" />
        </div>

        {/* Right side - login/signup or profile/cart */}
        <div className="navbar-end flex-none">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Cart icon */}
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart-icon lucide-shopping-cart"><circle cx="8" cy="21" r="1"/>
             <circle cx="19" cy="21" r="1"/>
             <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
             </svg>
              {/* Profile image dropdown */}
              <div className="dropdown dropdown-end">
                <img
                  src={user.profileImg}
                  alt="Profile"
                  tabIndex={0}
                  className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
                />
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32 mt-2">
                  <li>
                    <button
                      onClick={() => {
                        localStorage.removeItem('user');
                        window.location.reload();
                      }}
                    >Logout</button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline ml-2">Log in</Link>
              <Link to="/signUp" className="btn bg-[#A07856] border-none focus:outline-none ml-2 focus:ring-0">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;