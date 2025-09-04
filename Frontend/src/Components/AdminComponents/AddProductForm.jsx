import React, { useState } from "react";

const AddProductForm = ({ onProductAdded }) => {
  const [form, setForm] = useState({
    name: "",
    species: "",
    price: "",
    description: "",
    image: "",
    category: "",
    inStock: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      let result;
      try {
        result = await res.json();
      } catch (jsonErr) {
        throw new Error('Invalid server response');
      }
      if (!res.ok) {
        throw new Error(result.error || 'Failed to add product');
      }
  onProductAdded(result);
  setForm({ name: "", species: "", price: "", description: "", image: "", category: "", inStock: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white shadow">
      <h3 className="text-lg font-bold">Add Product</h3>
  <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="input" />
  <input name="species" value={form.species} onChange={handleChange} placeholder="Species (Greek/Latin name)" className="input" />
      <input name="price" value={form.price} onChange={handleChange} placeholder="Price" required className="input" />
      <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input" />
      <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="input" />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="input" />
      <label>
        <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange} /> In Stock
      </label>
      <button type="submit" disabled={loading} className="btn bg-black text-white">{loading ? "Adding..." : "Add Product"}</button>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
};

export default AddProductForm;
