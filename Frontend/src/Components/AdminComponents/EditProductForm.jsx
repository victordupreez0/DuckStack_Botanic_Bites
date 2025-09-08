import React, { useState, useEffect } from "react";
import { FaTrash, FaStar } from "react-icons/fa";

const EditProductForm = ({ product, onSaved, onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    species: "",
  price: "",
  specialPrice: "",
    description: "",
    category: "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [featured, setFeatured] = useState(false);
  const [specialDeal, setSpecialDeal] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  // mainRef: { type: 'existing'|'new', index: number }
  const [mainRef, setMainRef] = useState(null);

  useEffect(() => {
    if (!product) return;
    setForm({
      name: product.name || "",
      species: product.species || "",
  price: product.price ?? "",
  specialPrice: product.specialPrice ?? "",
      description: product.description || "",
      category: product.category || "",
    });
    setFeatured(Boolean(product.featured));
    setSpecialDeal(Boolean(product.specialDeal));
    setHidden(Boolean(product.hidden));
  setFiles([]);
  setExistingImages(Array.isArray(product.images) ? product.images.slice() : []);
  if (product.images && product.images.length > 0) setMainRef({ type: 'existing', index: 0 });
  else setMainRef(null);
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || '' : value }));
  };

  const handleFilesChange = (e) => {
    const chosen = Array.from(e.target.files).slice(0, 4);
    setFiles(prev => {
      const newArr = [...prev, ...chosen].slice(0, 4);
      // if no main selected yet, default to first new file
      if (!mainRef && newArr.length > 0) setMainRef({ type: 'new', index: 0 });
      return newArr;
    });
  };

  const removeExistingImage = (idx) => {
    setExistingImages(prev => {
      const next = prev.filter((_, i) => i !== idx);
      // adjust mainRef if needed
      if (mainRef && mainRef.type === 'existing') {
        if (mainRef.index === idx) {
          if (next.length > 0) setMainRef({ type: 'existing', index: 0 });
          else if (files.length > 0) setMainRef({ type: 'new', index: 0 });
          else setMainRef(null);
        } else if (mainRef.index > idx) {
          setMainRef({ type: 'existing', index: mainRef.index - 1 });
        }
      }
      return next;
    });
  };

  const removeNewFile = (idx) => {
    setFiles(prev => {
      const next = prev.filter((_, i) => i !== idx);
      if (mainRef && mainRef.type === 'new') {
        if (mainRef.index === idx) {
          if (existingImages.length > 0) setMainRef({ type: 'existing', index: 0 });
          else if (next.length > 0) setMainRef({ type: 'new', index: 0 });
          else setMainRef(null);
        } else if (mainRef.index > idx) {
          setMainRef({ type: 'new', index: mainRef.index - 1 });
        }
      }
      return next;
    });
  };

  const setExistingAsMain = (idx) => setMainRef({ type: 'existing', index: idx });
  const setNewAsMain = (idx) => setMainRef({ type: 'new', index: idx });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', form.name);
  // For bundles we'll set species to 'Bundle' on the backend; keep species editable for normal products
  formData.append('species', form.species || '');
      formData.append('price', form.price || '0');
  formData.append('specialPrice', form.specialPrice || '');
      formData.append('description', form.description || '');
      formData.append('category', form.category || '');
      formData.append('featured', featured);
      formData.append('specialDeal', specialDeal);
      formData.append('hidden', hidden);
      // Build final images array: existing URLs (after removals) and new files.
      // If a mainRef is set, place that image first.
      const existing = existingImages.slice();
      const newFiles = files.slice();
      let orderedUrls = [];
      let orderedFiles = [];
      if (mainRef) {
        if (mainRef.type === 'existing') {
          const mainUrl = existing[mainRef.index];
          if (mainUrl) orderedUrls.push(mainUrl);
          // push remaining existing
          existing.forEach((u, i) => { if (i !== mainRef.index) orderedUrls.push(u); });
          // then append new files
          orderedFiles = newFiles.slice();
        } else if (mainRef.type === 'new') {
          // main is a new file
          const mainFile = newFiles[mainRef.index];
          if (mainFile) orderedFiles.push(mainFile);
          // other new files
          newFiles.forEach((f, i) => { if (i !== mainRef.index) orderedFiles.push(f); });
          // then append existing urls
          orderedUrls = existing.slice();
        }
      } else {
        // no main selection: existing then new
        orderedUrls = existing.slice();
        orderedFiles = newFiles.slice();
      }

      // append URL strings first
      orderedUrls.forEach(u => formData.append('images', u));
      // then append files
      orderedFiles.forEach(f => formData.append('images', f));

      const res = await fetch(`http://localhost:3000/api/products/${product._id}`, {
        method: 'PATCH',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });
      // If product is a bundle, send to bundles endpoint instead
      let finalRes = res;
      if (product.isBundle) {
        finalRes = await fetch(`http://localhost:3000/api/bundles/${product._id}`, {
          method: 'PATCH',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: formData
        });
      }
      const bodyText = await finalRes.text();
      let parsed;
      try {
        parsed = JSON.parse(bodyText);
      } catch (e) {
        parsed = { raw: bodyText };
      }
      if (!finalRes.ok) {
        const msg = (parsed && (parsed.error || parsed.message)) ? (parsed.error || parsed.message) : (parsed.raw || 'Failed to update');
        throw new Error(msg);
      }
      if (onSaved) onSaved(parsed);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4 max-w-md">
      <h3 className="text-lg font-bold text-black w-full">Edit Product</h3>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="input border border-black bg-white text-black w-full m-2" />
      <input name="species" value={form.species} onChange={handleChange} placeholder="Species (Greek/Latin name)" className="input border border-black bg-white text-black w-full m-2" />
      <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" required className="input border border-black bg-white text-black w-full m-2" />
  <input type="number" name="specialPrice" value={form.specialPrice} onChange={handleChange} placeholder="Special Price (optional)" className="input border border-black bg-white text-black w-full m-2" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="textarea border border-black bg-white text-black w-full m-2" />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="input border border-black bg-white text-black w-full m-2" />
      <label className="block w-full m-2">
        <input type="file" accept="image/*" multiple onChange={handleFilesChange} className="file-input border border-black bg-white text-black w-full mt-2" />
      </label>
      {existingImages && existingImages.length > 0 && (
        <div className="w-full grid grid-cols-2 gap-3 m-2">
          {existingImages.map((src, i) => (
            <div key={i} className="relative w-full aspect-square overflow-hidden rounded bg-gray-100">
              <img src={src.startsWith('/') ? `http://localhost:3000${src}` : src} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-1 right-1 flex flex-col gap-1">
                <button type="button" onClick={() => removeExistingImage(i)} className="bg-black/90 text-white rounded px-1 py-0.5 text-[9px] border flex items-center justify-center">
                  <FaTrash size={12} />
                </button>
                <button type="button" onClick={() => setExistingAsMain(i)} className={`bg-black/90 text-white rounded px-1 py-0.5 text-[9px] border flex items-center justify-center ${mainRef && mainRef.type==='existing' && mainRef.index===i ? 'font-semibold' : ''}`}>
                  <FaStar size={12} />
                </button>
              </div>
              {mainRef && mainRef.type === 'existing' && mainRef.index === i && (
                <div className="absolute bottom-1 left-1 bg-black text-white text-[11px] px-1 rounded">Primary</div>
              )}
            </div>
          ))}
        </div>
      )}
      {files.length > 0 && (
        <div className="w-full grid grid-cols-2 gap-3 m-2">
          {files.map((f, i) => (
            <div key={i} className="relative w-full aspect-square overflow-hidden rounded bg-gray-100">
              <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
              <div className="absolute top-1 right-1 flex flex-col gap-1">
                <button type="button" onClick={() => removeNewFile(i)} className="bg-white/90 text-black rounded px-1 py-0.5 text-[9px] border">Remove</button>
                <button type="button" onClick={() => setNewAsMain(i)} className={`bg-white/90 text-black rounded px-1 py-0.5 text-[9px] border ${mainRef && mainRef.type==='new' && mainRef.index===i ? 'font-semibold' : ''}`}>Main</button>
              </div>
              {mainRef && mainRef.type === 'new' && mainRef.index === i && (
                <div className="absolute bottom-1 left-1 bg-black text-white text-[11px] px-1 rounded">Primary</div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 m-2">
        <label className="flex items-center gap-2 text-black bg-gray-100 px-4 py-2 rounded-full"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> Featured</label>
        <label className="flex items-center gap-2 text-black  bg-gray-100 px-4 py-2 rounded-full"><input type="checkbox" checked={specialDeal} onChange={(e) => setSpecialDeal(e.target.checked)} /> Special</label>
        <label className="flex items-center gap-2 text-black  bg-gray-100 px-4 py-2 rounded-full"><input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} /> Hide</label>
      </div>

      <div className="flex gap-2 m-2">
        <button type="submit" disabled={loading} className="btn bg-black text-white w-4/5">{loading ? 'Saving...' : 'Save'}</button>
        <button type="button" onClick={onCancel} className="btn bg-gray-200 text-black w-1/5 min-w-[70px]">Cancel</button>
      </div>
      {error && <div className="text-red-500 m-2">{error}</div>}
    </form>
  );
};

export default EditProductForm;
