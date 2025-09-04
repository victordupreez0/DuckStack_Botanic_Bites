import React, { useState } from "react";
import AddProductForm from "./AddProductForm";

const AddProductButton = ({ onProductAdded }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        className="btn bg-black text-white m-2"
        onClick={() => setShowModal(true)}
      >
        Add Product
      </button>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full relative">
            <button
              className="absolute top-2 right-3 text-2xl w-20 font-bold text-gray-500 hover:text-gray-800"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <AddProductForm onProductAdded={(product) => {
              onProductAdded(product);
              setShowModal(false);
            }} />
          </div>
        </div>
      )}
    </>
  );
};

export default AddProductButton;
