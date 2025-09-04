import React, { useState } from 'react';

function CartProduct() {
    const [quantity, setQuantity] = useState(1);

    const handleIncrease = () => setQuantity(prev => prev + 1);
    const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="card w-full md:w-5xl h-auto md:h-40 flex flex-col md:flex-row bg-gray-200 text-black shadow-sm">
            <figure className="w-full md:w-1/3">
                <img
                    className="w-full h-full object-cover"
                    src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
                    alt="product"
                />
            </figure>
            <div className="card-body text-left flex flex-col justify-between">
                <div>
                    <h2 className="card-title">New movie is released!</h2>
                    <p>Click the button to watch on Jetflix app.</p>
                </div>
                <div className="card-actions justify-start md:justify-end flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0 mt-2 md:mt-0">
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
                            className="input input-bordered input-sm w-12 text-center"
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