import React, { useState } from 'react';
import { FiTrash } from 'react-icons/fi';

function CartProduct() {
    const [quantity, setQuantity] = useState(1);

    const handleIncrease = () => setQuantity(prev => prev + 1);
    const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="flex w-full max-w-md md:max-w-2xl bg-white rounded-lg shadow p-3 md:p-4 gap-3 md:gap-6">
            <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                <img
                    src="https://placehold.co/600x400"
                    alt="Product"
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="flex flex-col flex-1 justify-between text-left">
                <h2 className="font-semibold text-base md:text-lg mb-1 text-black">Product Title</h2>
                <p className="text-gray-600 mb-2 text-sm md:text-base">Description</p>
                <div className="flex flex-row items-center justify-between gap-2 mt-2">
                    {/* Quantity selector */}
                    <div className="flex items-center px-2 py-1 border rounded-lg bg-gray-50">
                        <button 
                            style={{ width: '32px', height: '32px' }}
                            className="shadow-none text-xl font-bold bg-gray-200 text-black hover:bg-gray-300 rounded-full flex items-center justify-center p-0 border-none"
                            aria-label="Decrease quantity"
                            onClick={handleDecrease}
                        >-</button>
                        <input 
                            type="text" 
                            value={quantity} 
                            readOnly 
                            className="input input-sm w-10 text-center text-black bg-white font-semibold"
                            aria-label="Product quantity"
                        />
                        <button 
                            style={{ width: '32px', height: '32px' }}
                            className="shadow-none text-xl font-bold bg-gray-200 text-black hover:bg-gray-300 rounded-full flex items-center justify-center p-0 border-none"
                            aria-label="Increase quantity"
                            onClick={handleIncrease}
                        >+</button>
                    </div>
                    {/* Remove button */}
                    <button className="btn btn-sm bg-black hover:bg-[#6F4D38] text-white border-none transition-colors duration-150 flex items-center justify-center ml-2" aria-label="Remove from cart">
                        <FiTrash size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartProduct;