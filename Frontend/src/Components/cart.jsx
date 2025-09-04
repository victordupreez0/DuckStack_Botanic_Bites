import React from 'react';
import CartProduct from '../UI/Cart/cartProduct';
import CartHeader from './cartHeader'

function Cart() {
    return (
        <>
        <CartHeader />
            <div className="flex flex-col items-center mt-10 space-y-4">
                <CartProduct />
                <CartProduct />
                <CartProduct />
            </div>
        </>
    );
}

export default Cart;