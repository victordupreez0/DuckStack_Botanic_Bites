
import React from "react";
import logo from '../../assets/logo.png';

const Sidebar = () => (
  <div className="sidebar bg-gray-900 text-white w-64 h-full flex flex-col">
    <div className="sidebar-header flex items-center justify-center h-20 border-b border-gray-700">
      <img src={logo} alt="Admin Logo" className="h-10 w-10 mr-2 invert" />
      <span className="text-xl font-bold">Admin Panel</span>
    </div>
    <nav className="sidebar-menu flex-1 p-4">
      <ul className="space-y-2">
        <li>
          <a href="/dashboard" className="flex items-center p-2 rounded hover:bg-gray-800 transition-colors">
            <img src="/icons/dashboard.svg" alt="Dashboard Icon" className="h-5 w-5 mr-3" />
            <span>Dashboard</span>
          </a>
        </li>
        <li>
          <a href="/products" className="flex items-center p-2 rounded hover:bg-gray-800 transition-colors">
            <img src="/icons/products.svg" alt="Products Icon" className="h-5 w-5 mr-3" />
            <span>Products</span>
          </a>
        </li>
        <li>
          <a href="/orders" className="flex items-center p-2 rounded hover:bg-gray-800 transition-colors">
            <img src="/icons/orders.svg" alt="Orders Icon" className="h-5 w-5 mr-3" />
            <span>Orders</span>
          </a>
        </li>
        <li>
          <a href="/users" className="flex items-center p-2 rounded hover:bg-gray-800 transition-colors">
            <img src="/icons/users.svg" alt="Users Icon" className="h-5 w-5 mr-3" />
            <span>Users</span>
          </a>
        </li>
        <li>
          <a href="/settings" className="flex items-center p-2 rounded hover:bg-gray-800 transition-colors">
            <img src="/icons/settings.svg" alt="Settings Icon" className="h-5 w-5 mr-3" />
            <span>Settings</span>
          </a>
        </li>
      </ul>
    </nav>
    <div className="sidebar-footer p-4 border-t border-gray-700">
      <button className="w-full flex items-center justify-center py-2 px-4 bg-red-600 hover:bg-red-700 rounded transition-colors">
        <img src="/icons/logout.svg" alt="Logout Icon" className="h-5 w-5 mr-2" />
        Logout
      </button>
    </div>
  </div>
);

export default Sidebar;