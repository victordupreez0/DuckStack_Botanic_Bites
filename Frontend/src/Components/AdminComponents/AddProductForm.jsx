import React, { useState } from "react";

const AddProductForm = ({ onProductAdded }) => {
  const [form, setForm] = useState({
    name: "",
    species: "",
    price: "",
    description: "",
    category: "",
  });
  const [images, setImages] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleImageChange = (idx, file) => {
    setImages(prev => {
      const updated = [...prev];
      updated[idx] = file;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      images.forEach((img, idx) => {
        if (img) formData.append('images', img);
      });
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
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
      setForm({ name: "", species: "", price: "", description: "", category: "" });
      setImages([null, null, null, null]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white shadow" encType="multipart/form-data">
      <h3 className="text-lg font-bold">Add Product</h3>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="input" />
      <input name="species" value={form.species} onChange={handleChange} placeholder="Species (Greek/Latin name)" className="input" />
      <input name="price" value={form.price} onChange={handleChange} placeholder="Price" required className="input" />
      <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input" />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="input" />
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Product Images (up to 4):</label>
        {[0,1,2,3].map(idx => (
          <input
            key={idx}
            type="file"
            accept="image/*"
            onChange={e => handleImageChange(idx, e.target.files[0])}
            className="input"
          />
        ))}
      </div>
      <button type="submit" disabled={loading} className="btn bg-black text-white">{loading ? "Adding..." : "Add Product"}</button>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
};

export default AddProductForm;
