
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
              <tr key={product._id || product.name}>
                <th>{idx + 1}</th>
                <td>{product.name}</td>
                <td>{product.species || '-'}</td>
                <td>R{product.price}</td>
                <td>1</td>
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