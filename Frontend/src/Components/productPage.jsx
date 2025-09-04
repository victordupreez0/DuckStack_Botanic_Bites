import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiExternalLink } from "react-icons/fi";
import ProductImageGallery from '../UI/productImageGallery'

function ProductPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product; // grab the product from navigation state

  return (
    <div className="w-[100vw] p-8 rounded-lg flex flex-col md:flex-row relative">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate(-1)}
          className="text-black hover:text-gray-900 font-semibold"
        >
          <FiArrowLeft size={30} />
        </button>
      </div>
 <div className="flex-1 flex justify-center items-center">
      <ProductImageGallery/>
      </div>
      
      <div className="flex-1 md:ml-20 pr-8 mb-4 md:mb-0">
        
        <div className="flex flex-col mb-4">
          

          <h2 className="text-5xl text-black mt-10 text-left font-bold">
            {product?.title || "Product Title"}
          </h2>
         
        </div>
        <p className="mt-2 h-50 text-black text-left font-light">
          {product?.description || "Product description here..."}
        </p>
       
       <div className="mt-10">
        <p className="mt-2 text-black text-4xl text-left font-semibold">
          Price: {product?.price || "R0"}
        </p>
        <p className="mt-1 text-left text-black">Stock: {product?.stock || "N/A"}</p>

       <div className="flex mt-5 justify-start gap-2">
         <button className="btn text-white">Add To Cart</button>
         <button className="btn btn-outline border-black text-black hover:bg-gray-200 hover:text-black flex items-center">
           <FiExternalLink className="mr-2" />
           Care Guide
         </button>
       </div>
        </div>
        
      </div>

     
    </div>
  );
}

export default ProductPage;