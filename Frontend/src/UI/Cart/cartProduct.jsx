import React, { useState } from 'react';

function CartProduct() {
    const [quantity, setQuantity] = useState(1);

    const handleIncrease = () => setQuantity(prev => prev + 1);
    const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="flex flex-col md:flex-row items-center w-full max-w-2xl bg-white rounded-lg shadow p-4 gap-4 md:gap-6">
            <div className="flex-shrink-0 w-full md:w-32 h-32 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                <img
                    src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
                    alt="Product"
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="flex flex-col flex-1 w-full">
                <h2 className="font-semibold text-lg mb-1 text-black">Product Title</h2>
                <p className="text-gray-600 mb-2">Description</p>
                <div className="flex flex-col md:flex-row items-center justify-between gap-2 mt-2">
                    {/* Quantity selector */}
                    <div className="flex items-center gap-2">
                        <button 
                            className="btn btn-sm btn-outline" 
                            aria-label="Decrease quantity"
                            onClick={handleDecrease}
                        >-</button>
                        <input 
                            type="text" 
                            value={quantity} 
                            readOnly 
                            className="input input-bordered input-sm w-12 text-center text-black bg-white"
                            aria-label="Product quantity"
                        />
                        <button 
                            className="btn btn-sm btn-outline" 
                            aria-label="Increase quantity"
                            onClick={handleIncrease}
                        >+</button>
                    </div>
                    {/* Remove button */}
                    <button className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none transition-colors duration-150" aria-label="Remove from cart">
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartProduct;