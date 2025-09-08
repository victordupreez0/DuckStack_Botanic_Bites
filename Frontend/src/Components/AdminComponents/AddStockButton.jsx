import React, { useState } from "react";
import AddStockForm from "./StocktakeForm";

const AddStockButton = ({ products, onStockUpdated }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        className="btn bg-black text-white m-2"
        onClick={() => setShowModal(true)}
      >
        Add Stock
      </button>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full relative">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setShowModal(false)}
              className="absolute top-1.5 right-1.5 flex items-center justify-center focus:outline-none group"
              style={{ width: '52px', height: '52px' }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                className="stroke-black group-hover:stroke-gray-600"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
              <span className="sr-only">Close</span>
            </button>
            <AddStockForm products={products} onStockUpdated={async () => {
              await onStockUpdated();
              setShowModal(false);
            }} />
          </div>
        </div>
      )}
    </>
  );
};

export default AddStockButton;
