
import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import AddProductForm from "./AddProductForm";

const Admin = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      // handle error
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductAdded = (product) => {
    setProducts((prev) => [...prev, product]);
  };

  return (
    <div style={{ display: "flex", height: "95vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "2rem" }}>
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard - Products</h2>
        <AddProductForm onProductAdded={handleProductAdded} />
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2">Current Products</h3>
          <ul>
            {products.map((p) => (
              <li key={p._id || p.name} className="mb-2">
                <span className="font-semibold">{p.name}</span>
                {p.species && <span className="ml-2 text-gray-500">({p.species})</span>} - R{p.price} {p.inStock ? "(In Stock)" : "(Out of Stock)"}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Admin;