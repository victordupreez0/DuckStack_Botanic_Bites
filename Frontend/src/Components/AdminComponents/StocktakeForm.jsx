import React, { useState } from 'react';

const AddStockForm = ({ products = [], onStockUpdated }) => {
  const [productId, setProductId] = useState('');
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  setError(''); // Clear error before submit
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/products/${productId}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ amount: Number(amount) })
      });
      const result = await res.json();
      if (!res.ok || !result || !result._id) {
        setError(result.error || 'Failed to update stock');
        return;
      }
      setError(''); // Clear error if update succeeds
      // Always refresh product list for live table
      if (onStockUpdated) await onStockUpdated();
      setProductId('');
      setAmount(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white mt-6">
      <h3 className="text-lg font-bold text-black">Add Stock</h3>
      <select value={productId} onChange={(e) => setProductId(e.target.value)} required className="input border border-black bg-white text-black w-full m-2">
        <option value="">Select product</option>
        {products.map((p) => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>
      <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} className="input border border-black bg-white text-black w-full m-2" />
      <button type="submit" disabled={loading} className="btn mt-5 bg-black text-white">{loading ? 'Updating...' : 'Add Stock'}</button>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
};

export default AddStockForm;
