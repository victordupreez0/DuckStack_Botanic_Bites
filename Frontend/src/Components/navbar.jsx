import React, { useEffect, useState } from 'react';
// Add your 9 different image URLs here
const profileImages = [
  'https://i.guim.co.uk/img/media/b219034a3fd5933aa18ed7d0bcbc723d0c2d0846/0_611_3412_2047/master/3412.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=9e8d4463ae89981a4ca00e3b807d7421',
  'https://www.shutterstock.com/image-photo/closeup-venus-flytrap-insectivorous-plants-600nw-2474016693.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2GWxiYfbHy1dUyKYy_k_bfTD7cg_2r777yw&s',
  'https://platform.vox.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/24724370/B88A7771.jpeg?quality=90&strip=all&crop=0.009170946441678,0,99.981658107117,100',
  'https://www.thoughtco.com/thmb/9ToT07iB1NWHAZOnCobUbRFHAEk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/venus-fly-trap-2-533d86a86c014c3b84ab7cad363d94a1.jpg',
  'https://images.squarespace-cdn.com/content/v1/54fbb611e4b0d7c1e151d22a/de308924-0a0e-4528-b559-c6b5d9cb61a5/Carnivorous-Pitcher-Plants-North-Carolina.jpg',
  'https://allthatsinteresting.com/wordpress/wp-content/uploads/2013/12/carnivorous-plants-butterwort.jpg',
  'https://cdn.mos.cms.futurecdn.net/WWSeFixpHqc5i5CaYD4T3m.jpg',
  'https://www.allianceforthebay.org/wp-content/uploads/2020/10/carn-1.jpg'
];
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';

function Navbar() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(() => {
    const handleStorage = () => {
      setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Also update on navigation (in case localStorage is set in same tab)
  useEffect(() => {
    const interval = setInterval(() => {
      setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    }, 500);
    return () => clearInterval(interval);
  }, []);
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
        <div className="navbar-center w-10 md:mr-[-30px]">
          <img src={Logo} className="invert" alt="Logo" />
        </div>

        {/* Right side - login/signup or profile/cart */}
        <div className="navbar-end flex-none">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Cart icon */}
          <Link to="/cart">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-shopping-cart-icon"
  >
    <circle cx="8" cy="21" r="1"/>
    <circle cx="19" cy="21" r="1"/>
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
  </svg>
</Link>
              {/* Profile image dropdown */}
              <div className="dropdown dropdown-end">
                <img
                  src={profileImages[user.profileImgIndex ?? 0]}
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