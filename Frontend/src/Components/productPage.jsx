import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiExternalLink } from "react-icons/fi";
import ProductImageGallery from '../UI/productImageGallery'

export default function ProductPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product; // grab the product from navigation state

  const [showToast, setShowToast] = useState(false);
  const [toastName, setToastName] = useState('');
  const [visibleToast, setVisibleToast] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const showAddedToast = (name) => {
    setToastName(name || 'Item');
    setShowToast(true);
    // make it visible for animation
    setVisibleToast(true);
    // start hide animation after 2s
    setTimeout(() => setVisibleToast(false), 2000);
    // unmount after animation finishes
    setTimeout(() => setShowToast(false), 2300);
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/logIn');
      const res = await fetch('http://localhost:3000/api/cart/item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
  // add the selected quantity to the existing cart amount
  body: JSON.stringify({ productId: product._id || product.id, quantity, increment: true }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Add to cart failed', err);
        return;
      }
      showAddedToast(product?.name || 'Item');
    } catch (e) {
      console.error('Add to cart error', e);
    }
  };

  return (
    <div className="w-[100vw] p-8 rounded-lg flex flex-col md:flex-row relative">
      <div className="absolute top-4 left-4">
        <button onClick={() => navigate(-1)} className="text-black hover:text-gray-900 font-semibold mb-4 md:mb-0">
          <FiArrowLeft size={30} />
        </button>
      </div>

      <div className="flex-1 flex justify-center items-center mt-5">
        <ProductImageGallery imagesProp={product?.images} />
      </div>

      <div className="flex-1 md:ml-20 pr-8 mb-4 md:mb-0">
        <div className="flex flex-col mb-4">
          <h2 className="text-5xl text-black mt-10 text-left font-bold">{product?.name || product?.title || 'Product Title'}</h2>
        </div>
        <p className="mt-2 h-50 text-black text-left font-light">{product?.description || 'Product description here...'}</p>

        <div className="mt-10">
          <p className="mt-2 text-black text-4xl text-left font-semibold">Price: R{product?.price ?? '0'}</p>
          <p className="mt-1 text-left text-black">Stock: {product?.stock || 'N/A'}</p>

          <div className="flex mt-5 justify-start gap-2 relative items-center">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button className="px-3 py-1 bg-gray-200 text-black" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <input className="w-12 text-center text-black" value={quantity} readOnly />
              <button className="px-3 py-1 bg-gray-200 text-black" onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
            <button className="btn text-white" onClick={handleAddToCart}>Add To Cart</button>
            <Link to='/care' className="btn btn-outline border-black text-black hover:bg-gray-200 hover:text-black flex items-center">
              <FiExternalLink className="mr-2" />
              Care Guide
            </Link>

            {/* Inline DaisyUI toast positioned below the Add To Cart button */}
            {showToast && (
              <div
                className={`absolute left-0 top-full mt-2 z-50 transform transition-all duration-300 ${visibleToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                style={{ position: 'absolute', left: 0, top: '100%', marginTop: '0.5rem' }}
              >
                <div className="inline-block">
                  <div className="alert alert-success shadow-lg">
                    <div>
                      <span className="font-semibold">{toastName}</span>
                      <span className="block text-sm">added to cart</span>
                    </div>
                    <div className="flex-none">
                      <button className="btn btn-sm btn-ghost text-black" onClick={() => navigate('/cart')}>View Cart</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

  {/* toast is rendered inline next to the buttons */}
    </div>
  );
}