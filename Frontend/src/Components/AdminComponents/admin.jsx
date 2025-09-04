
import React from "react";
import Sidebar from "./sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./dashboard";
import AddProductForm from "./addProductForm";
import ProductsTable from "./productsTable";
import Orders from "./orders";
import Users from "./users";

const ProductsPage = () => {
  const [products, setProducts] = React.useState([]);
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {}
  };
  React.useEffect(() => { fetchProducts(); }, []);
  const handleProductAdded = (product) => { setProducts((prev) => [...prev, product]); };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <AddProductForm onProductAdded={handleProductAdded} />
      <div className="mt-8">
        <ProductsTable products={products} />
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