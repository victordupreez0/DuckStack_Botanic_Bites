import React from 'react';
import CartProduct from '../UI/Cart/cartProduct';
import CartHeader from './cartHeader';
import CartSummary from './cartSummary';
import { motion } from "framer-motion";

function Cart() {
    return (
        <>
       
        <CartHeader />
                <motion.div
                    className="flex flex-col md:flex-row gap-8 w-full max-w-5xl mx-auto mt-10 mb-20"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="flex flex-col flex-1 items-center space-y-4">
                        <CartProduct />
                        <CartProduct />
                        <CartProduct />
                    </div>
                    <div className="flex-1 md:max-w-xs w-full md:sticky md:top-24">
                        <CartSummary />
                    </div>
                </motion.div>
        </>
    );
}

export default Cart;