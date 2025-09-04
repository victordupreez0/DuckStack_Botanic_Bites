
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
  <div className="overflow-x-auto rounded-box border border-gray-200 bg-white">
  <table className="table bg-white text-black">
        <thead className="text-black">
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
              <tr key={product._id || product.name} className="hover:bg-gray-100">
                <th>{idx + 1}</th>
                <td className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded overflow-hidden bg-gray-200">
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
                <td className="font-semibold">R{product.price}</td>
                <td>{product.stock ?? 0}</td>
                <td>
                  <button
                    className="btn btn-error btn-xs m-2 text-white"
                    onClick={() => handleDeleteClick(product)}
                    data-id={product._id}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-base btn-xs m-2 text-white"
                    onClick={() => handleDeleteClick(product)}
                    data-id={product._id}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center text-gray-500 bg-white">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* DaisyUI Modal */}
      {modalOpen && (
        <dialog id="delete_modal" className="modal modal-open">
          <div className="modal-box bg-white text-black border border-gray-200">
            <h3 className="font-bold text-lg">Are you sure?</h3>
            <p className="py-4">Do you really want to delete <span className="font-semibold">{selectedProduct?.name}</span>?</p>
            <div className="modal-action">
              <button className="btn btn-error text-white" onClick={confirmDelete}>Yes, delete</button>
              <button className="btn bg-gray-200 text-black" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ProductsTable;