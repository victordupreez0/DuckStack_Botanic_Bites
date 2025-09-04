import React, { useState } from 'react';

function CartProduct() {
    const [quantity, setQuantity] = useState(1);

    const handleIncrease = () => setQuantity(prev => prev + 1);
    const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="card md:w-5xl card-side bg-gray-200 text-black shadow-sm">
            <figure className="w-50">
                <img
                    src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
                    alt="product"
                />
            </figure>
            <div className="card-body text-left">
                <h2 className="card-title">Product Title</h2>
                <p>Description</p>
                <div className="card-actions justify-end items-center space-x-2">
                    {/* Quantity selector */}
                    <div className="flex items-center space-x-2">
                        <button 
                            className="btn btn-sm btn-outline" 
                            onClick={handleDecrease}
                        >-</button>
                        <input 
                            type="text" 
                            value={quantity} 
                            readOnly 
                            className="input input-bordered text-white input-sm w-12 text-center"
                        />
                        <button 
                            className="btn btn-sm btn-outline" 
                            onClick={handleIncrease}
                        >+</button>
                    </div>

                    {/* Remove button */}
                    <button className="btn bg-black text-white border-none focus:outline-none focus:ring-0">
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartProduct;