import React, { useState } from 'react';
import { FiTrash } from 'react-icons/fi';

function CartProduct() {
    const [quantity, setQuantity] = useState(1);

    const handleIncrease = () => setQuantity(prev => prev + 1);
    const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="flex flex-col md:flex-row items-center w-full max-w-2xl bg-white rounded-lg shadow p-4 gap-4 md:gap-6">
            <div className="flex-shrink-0 w-full md:w-32 h-32 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                <img
                    src="https://placehold.co/600x400"
                    alt="Product"
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="flex flex-col flex-1 w-full text-left">
                <h2 className="font-semibold text-lg mb-1 text-black">Product Title</h2>
                <p className="text-gray-600 mb-2">Description</p>
                <div className="flex flex-col md:flex-row items-center justify-between gap-2 mt-2">
                    {/* Quantity selector */}
                        <div className="flex items-center px-3 py-2 border ">
                        <button 
                            className="shadow-none text-2xl font-bold bg-gray-200 text-black hover:bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center"
                            aria-label="Decrease quantity"
                            onClick={handleDecrease}
                        >-</button>
                        <input 
                            type="text" 
                            value={quantity} 
                            readOnly 
                            className="input input-sm w-12 text-center text-black bg-white font-semibold"
                            aria-label="Product quantity"
                        />
                        <button 
                            className="shadow-none text-2xl font-bold bg-gray-200 text-black hover:bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center"
                            aria-label="Increase quantity"
                            onClick={handleIncrease}
                        >+</button>
                    </div>
                    {/* Remove button */}
                    <button className="btn btn-sm bg-black hover:bg-[#6F4D38] text-white border-none transition-colors duration-150 flex items-center justify-center" aria-label="Remove from cart">
                        <FiTrash size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartProduct;