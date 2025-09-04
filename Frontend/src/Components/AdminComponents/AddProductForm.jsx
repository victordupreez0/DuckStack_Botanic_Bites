import React, { useState } from "react";

const AddProductForm = ({ onProductAdded }) => {
  const [form, setForm] = useState({
  name: "",
  species: "",
  price: "",
  description: "",
  category: "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleFilesChange = (e) => {
    const chosen = Array.from(e.target.files).slice(0, 4);
    setFiles(chosen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('species', form.species || '');
      formData.append('price', form.price || '0');
      formData.append('description', form.description || '');
      formData.append('category', form.category || '');
      files.forEach(f => formData.append('images', f));

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
  setFiles([]);
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
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="textarea" />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="input" />
      <label className="block">
        <span className="text-sm">Upload up to 4 images</span>
        <input type="file" accept="image/*" multiple onChange={handleFilesChange} className="file-input file-input-bordered w-full mt-2" />
      </label>
      {files.length > 0 && (
        <div className="flex gap-2">
          {files.map((f, i) => (
            <div key={i} className="w-20 h-20 overflow-hidden rounded bg-gray-100">
              <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
      <button type="submit" disabled={loading} className="btn bg-black text-white">{loading ? "Adding..." : "Add Product"}</button>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
};

export default AddProductForm;
