
import React from "react";
import logo from '../../assets/logo.png';
import { Link } from "react-router-dom";

const Sidebar = () => (
  <div className="sidebar bg-black text-white w-64 h-full flex flex-col">
    <div className="sidebar-header flex items-center justify-center h-20 border-b border-gray-700">
      <img src={logo} alt="Admin Logo" className="h-10 w-10 mr-2 invert" />
      <span className="text-xl font-bold">Admin Panel</span>
    </div>
    <nav className="sidebar-menu flex-1 p-4">
      <ul className="space-y-2">
        <li>
          <Link to="/admin/dashboard" className="flex items-center p-2 rounded hover:bg-gray-800 transition-colors gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-gauge-icon lucide-gauge">
            <path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>
            </svg>
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/products" className="flex items-center p-2 rounded hover:bg-gray-800 transition-colors gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sprout-icon lucide-sprout"><path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/>
            <path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/><path d="M5 21h14"/>
            </svg>
            <span>Products</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/orders" className="flex items-center p-2 rounded hover:bg-gray-800 transition-colors gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-basket-icon lucide-shopping-basket"><path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/>
            <path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/>
            </svg>
            <span>Orders</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="flex items-center p-2 rounded hover:bg-gray-800 transition-colors gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-icon lucide-user">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Users</span>
          </Link>
        </li>
        <li>
          <a href="/settings" className="flex items-center p-2 rounded hover:bg-gray-800 transition-colors gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cog-icon lucide-cog"><path d="M11 10.27 7 3.34"/><path d="m11 13.73-4 6.93"/><path d="M12 22v-2"/><path d="M12 2v2"/><path d="M14 12h8"/><path d="m17 20.66-1-1.73"/><path d="m17 3.34-1 1.73"/><path d="M2 12h2"/><path d="m20.66 17-1.73-1"/><path d="m20.66 7-1.73 1"/>
            <path d="m3.34 17 1.73-1"/><path d="m3.34 7 1.73 1"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="8"/>
            </svg>
            <span>Settings</span>
          </a>
        </li>
      </ul>
    </nav>
    <div className="sidebar-footer p-4 border-t border-gray-700">
    <h6>Created by Duckstack</h6>
    </div>
  </div>
);

export default Sidebar;