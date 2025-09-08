import React, { useState } from 'react';

const AddBundleForm = ({ products = [], onBundleAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([]); // { productId, qty }
  const [price, setPrice] = useState('');
  const [specialPrice, setSpecialPrice] = useState('');
  const [specialDeal, setSpecialDeal] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addEmptyItem = () => setItems(prev => ([...prev, { productId: '', qty: 1 }]));
  const handleFilesChange = (e) => {
    const chosen = Array.from(e.target.files).slice(0, 6);
    setFiles(chosen);
  };
  const removeItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));
  const updateItem = (idx, field, value) => setItems(prev => prev.map((it, i) => i === idx ? { ...it, [field]: value } : it));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // basic validation
      if (!title.trim()) throw new Error('Please provide a title for the bundle');
      if (items.length === 0) throw new Error('Add at least one product to the bundle');
      const payload = {
        title: title.trim(),
        description: description.trim(),
        price: Number(price) || 0,
        items: items.map(it => ({ productId: it.productId, qty: Number(it.qty) || 1 }))
      };

      const token = localStorage.getItem('token');
      // send as multipart if files present
      let res;
      if (files && files.length) {
        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('description', payload.description);
        formData.append('price', payload.price);
  formData.append('items', JSON.stringify(payload.items));
  formData.append('specialPrice', specialPrice);
  formData.append('specialDeal', specialDeal);
        files.forEach(f => formData.append('images', f));
        res = await fetch('http://localhost:3000/api/bundles', {
          method: 'POST',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: formData
        });
      } else {
        res = await fetch('http://localhost:3000/api/bundles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ ...payload, specialPrice, specialDeal })
        });
      }
      let result;
      try {
        result = await res.json();
      } catch (e) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || 'Invalid server response');
      }
  if (!res.ok) throw new Error(result.error || 'Failed to create bundle');
    if (onBundleAdded) onBundleAdded(result);
      // clear form
  setTitle(''); setDescription(''); setItems([]); setPrice(''); setFiles([]); setSpecialPrice(''); setSpecialDeal(false);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4 max-w-md">
      <h3 className="text-lg font-bold text-black w-full">Add Bundle Deal</h3>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Bundle title" className="input border border-black bg-white text-black w-full m-2" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="textarea border border-black bg-white text-black w-full m-2" />

      <div className="bg-white border border-gray-200 rounded p-2 m-2">
        <div className="flex items-center justify-between mb-2">
          <strong className="text-sm">Products in bundle</strong>
          <button type="button" onClick={addEmptyItem} className="btn bg-gray-200 text-black px-2 py-1 text-sm">Add product</button>
        </div>
        {items.length === 0 && <div className="text-sm text-gray-500">No products added yet</div>}
        <div className="space-y-2 mt-2">
          {items.map((it, i) => (
            <div key={i} className="flex gap-2 items-center">
              <select value={it.productId} onChange={(e) => updateItem(i, 'productId', e.target.value)} className="input border border-black bg-white text-black flex-1">
                <option value="">Select product</option>
                {products.map(p => (<option key={p._id} value={p._id}>{p.name}</option>))}
              </select>
              <input type="number" min="1" value={it.qty} onChange={(e) => updateItem(i, 'qty', e.target.value)} className="input border border-black bg-white text-black w-20" />
              <button type="button" onClick={() => removeItem(i)} className="text-red-600">Remove</button>
            </div>
          ))}
        </div>
      </div>

      <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Bundle price (optional)" className="input border border-black bg-white text-black w-full m-2" />

      <button type="submit" disabled={loading} className="btn bg-black text-white m-2 w-full">{loading ? 'Creating...' : 'Create Bundle'}</button>
      {error && <div className="text-red-500 m-2">{error}</div>}
    </form>
  );
};

export default AddBundleForm;
