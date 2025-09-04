
import React from "react";
import Sidebar from "./sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./dashboard";
import AddProductForm from "./AddProductForm";
import AddStockForm from "./StocktakeForm";
import ProductsTable from "./productsTable";
import Orders from "./orders";
import Users from "./users";

const ProductsPage = () => {
  const [products, setProducts] = React.useState([]);
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch("http://localhost:3000/api/products?showAll=true", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {}
  };
  React.useEffect(() => { fetchProducts(); }, []);
  const handleProductAdded = async (product) => {
    // After adding, refresh product list from backend to get correct _id
    await fetchProducts();
  };
  const handleDeleteProduct = async (product) => {
    if (!product._id) return;
    try {
      // Always use correct backend port
      const apiUrl = `http://localhost:3000/api/products/${product._id}`;
      const token = localStorage.getItem('token');
      const res = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        await fetchProducts();
      } else {
        let errorText = await res.text();
        let errorMsg = 'Unknown error';
        try {
          errorMsg = JSON.parse(errorText).error || errorText;
        } catch {
          errorMsg = errorText || 'Unknown error';
        }
        alert('Failed to delete product: ' + errorMsg);
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <AddProductForm onProductAdded={handleProductAdded} />
  <AddStockForm products={products} onStockUpdated={async () => {
        await fetchProducts();
      }} />
      <div className="mt-8">
        <ProductsTable products={products} onDelete={handleDeleteProduct} />
      </div>
    </div>
  );
};

const Admin = () => (
  <div style={{ display: "flex", height: "95vh" }}>
    <Sidebar />
    <main style={{ flex: 1, padding: "2rem" }}>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<Orders />} />
        <Route path="users" element={<Users />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </main>
  </div>
);

export default Admin;