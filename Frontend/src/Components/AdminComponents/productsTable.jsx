
import React, { useState } from 'react';

const ProductsTable = ({ products, onDelete }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProduct && onDelete) {
      await onDelete(selectedProduct);
    }
    setModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Species</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products && products.length > 0 ? (
            products.map((product, idx) => (
              <tr key={product._id || product.name} className="hover">
                <th>{idx + 1}</th>
                <td className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                    {
                      (() => {
                        const src = product.images && product.images[0] ? product.images[0] : null;
                        if (!src) return <img src={'/vite.svg'} alt={product.name} className="w-full h-full object-cover" />;
                        if (typeof src === 'object') {
                          const candidate = src.original || src.thumb || null;
                          if (candidate) return <img src={(candidate.startsWith('/uploads') ? `http://localhost:3000${candidate}` : candidate)} alt={product.name} className="w-full h-full object-cover" />;
                        }
                        const s = String(src);
                        if (s.startsWith('http://') || s.startsWith('https://')) return <img src={s} alt={product.name} className="w-full h-full object-cover" />;
                        if (s.startsWith('/uploads')) return <img src={`http://localhost:3000${s}`} alt={product.name} className="w-full h-full object-cover" />;
                        if (s.startsWith('uploads/')) return <img src={`http://localhost:3000/${s}`} alt={product.name} className="w-full h-full object-cover" />;
                        return <img src={s} alt={product.name} className="w-full h-full object-cover" />;
                      })()
                    }
                  </div>
                  <span>{product.name}</span>
                </td>
                <td>{product.species || '-'}</td>
                <td>R{product.price}</td>
                <td>{product.stock ?? 0}</td>
                <td>
                  <button
                    className="btn btn-error btn-xs"
                    onClick={() => handleDeleteClick(product)}
                    data-id={product._id}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* DaisyUI Modal */}
      {modalOpen && (
        <dialog id="delete_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Are you sure?</h3>
            <p className="py-4">Do you really want to delete <span className="font-semibold">{selectedProduct?.name}</span>?</p>
            <div className="modal-action">
              <button className="btn btn-error" onClick={confirmDelete}>Yes, delete</button>
              <button className="btn" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ProductsTable;