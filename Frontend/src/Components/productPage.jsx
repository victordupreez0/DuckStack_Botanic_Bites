import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

function ProductPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product; // grab the product from navigation state

  return (
    <div className="w-[100vw] bg-white p-8 rounded-lg flex flex-col md:flex-row">

      
      <div className="flex-1 pr-8 mb-4 md:mb-0">
        <div className="flex items-center mb-4">
           <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            <FiArrowLeft />
          </button>
          <h1 className="text-2xl text-black text-left font-bold mr-4">
            {product?.title || "Product Title"}
          </h1>
         
        </div>
        <p className="mt-2 text-black text-left font-light">
          {product?.description || "Product description here..."}
        </p>
        <p className="mt-2 text-black text-left font-semibold">
          Price: {product?.price || "R0"}
        </p>
        <p className="mt-1 text-left text-black">Stock: {product?.stock || "N/A"}</p>
      </div>

      <div className="flex-1 flex justify-center items-center">
        <img
          src={product?.image || ""}
          alt={product?.title || "Product Image"}
          className="w-full max-h-96 object-contain"
        />
      </div>
    </div>
  );
}

export default ProductPage;