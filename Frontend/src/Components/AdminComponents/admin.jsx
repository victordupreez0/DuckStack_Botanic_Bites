
import React from "react";
import Sidebar from "./sidebar";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./dashboard";
import History from "./history";
import AddProductButton from "./AddProductButton";
import AddStockButton from "./AddStockButton";
import AddBundleButton from "./AddBundleButton";
import ProductsTable from "./productsTable";
import Orders from "./orders";
import Users from "./users";

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = React.useState([]);
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch("http://localhost:3000/api/products?showAll=true", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      let data;
      try {
        data = await res.json();
      } catch (e) {
        const txt = await res.text().catch(() => '');
        console.warn('Non-JSON response from products API:', txt);
        data = [];
      }
      // also fetch bundles and merge as special products
      try {
        const bres = await fetch('http://localhost:3000/api/bundles');
        let bundles = [];
        try { bundles = await bres.json(); } catch (e) { bundles = []; }
        if (Array.isArray(bundles) && bundles.length) {
          const bundleProducts = bundles.map(b => ({
            _id: b._id || b._id?._id || (b._id && b._id.$oid) || b._id,
            name: b.title || b.name || 'Bundle',
            species: 'Bundle',
            price: b.price || 0,
            specialPrice: b.specialPrice !== undefined ? b.specialPrice : undefined,
            description: b.description || '',
            images: b.images || [],
            stock: (typeof b.stock === 'number') ? b.stock : (b.stock ? Number(b.stock) : 0),
            isBundle: true,
            bundleItems: b.items || [],
            specialDeal: b.specialDeal === true || b.specialDeal === 'true' || false
          }));
          // append bundles to the products array so admins can edit/delete them
          if (Array.isArray(data)) data = data.concat(bundleProducts);
          else data = bundleProducts.concat(data || []);
        }
      } catch (e) { /* non-fatal */ }
      // normalize _id to string for frontend usage (avoid [object Object])
      const normalized = Array.isArray(data) ? data.map(p => ({
        ...p,
        _id: p && p._id && typeof p._id === 'object' ? (p._id.$oid || (p._id.toString ? p._id.toString() : String(p._id))) : p._id
      })) : data;
      setProducts(normalized);
    } catch (err) {}
  };
  React.useEffect(() => { fetchProducts(); }, []);
  React.useEffect(() => {
    const handler = () => { fetchProducts(); };
    window.addEventListener('admin:productUpdated', handler);
    return () => window.removeEventListener('admin:productUpdated', handler);
  }, []);
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
  // ...existing code...
  return (
    <div>
      <h2 className="text-2xl text-left text-black font-bold mb-4">Products</h2>
      <div className="justify-start flex">
  <AddProductButton onProductAdded={handleProductAdded} />
      <AddStockButton products={products} onStockUpdated={async () => {
        await fetchProducts();
      }} />
      <AddBundleButton products={products} onBundleAdded={async () => {
        // reload products to ensure any changes are visible
        await fetchProducts();
        try { window.dispatchEvent(new CustomEvent('admin:bundleAdded')); } catch(e){}
      }} />
      <button
        className="btn bg-black text-white m-2"
        onClick={() => navigate('history')}
      >
        History
      </button>
      </div>
      <div className="mt-8">
        <ProductsTable products={products} onDelete={handleDeleteProduct} />
      </div>
    </div>
  );
};

const Admin = () => (
  <div style={{ display: "flex", height: "100vh" }}>
    <Sidebar />
    <main style={{ flex: 1, padding: "2rem" }}>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
  <Route path="products" element={<ProductsPage />} />
  <Route path="products/history" element={<History />} />
        <Route path="orders" element={<Orders />} />
        <Route path="users" element={<Users />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </main>
  </div>
);

export default Admin;