import React, { useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function CartSummary() {
    const [quantity, setQuantity] = useState(1);

    const handleIncrease = () => setQuantity(prev => prev + 1);
    const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="w-full rounded-lg text-left p-5">
           <h2 className="text-black font-bold text-3xl">
            Order Summary
           </h2>

           <div className="mt-5">

            <div className="flex">
           <p className="text-black text-lg font-semibold">Subtotal</p> 
           <p className="ml-auto text-lg text-black  ">R300</p>
           </div>

                        <div className="flex items-center">
                            <p className="text-black text-lg font-semibold">Shipping</p>
                            <span className="ml-auto flex items-center gap-2 text-lg text-black ">
                                To be calculated
                                <span className="tooltip tooltip-left md:tooltip-top" data-tip="Shipping is calculated at checkout with Courier Guy.">
                                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-300 text-black font-bold cursor-pointer">?</span>
                                </span>
                            </span>
                        </div>
           
            </div>

            <div className="btn mt-10 w-full hover:bg-[#6F4D38]">Checkout</div>
            <Link to='/shop' className="btn mt-2 w-full bg-white text-black hover:bg-gray-100">Continue Shopping</Link>

        </div>
    );
}

export default CartSummary;