import React from 'react';
import CartProduct from '../UI/Cart/cartProduct';
import CartHeader from './cartHeader'
import CartSummary from './cartSummary';

function Cart() {
    return (
        <>
       
        <CartHeader />
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl mx-auto mt-10 mb-20">
            <div className="flex flex-col flex-1 items-center space-y-4">
                <CartProduct />
                <CartProduct />
                <CartProduct />
            </div>
            <div className="flex-1 md:max-w-xs w-full md:sticky md:top-24">
                <CartSummary />
            </div>
        </div>
        </>
    );
}

export default Cart;