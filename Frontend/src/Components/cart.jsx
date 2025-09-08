import React from 'react';
import CartProduct from '../UI/Cart/cartProduct';
import CartHeader from './cartHeader';
import CartSummary from './cartSummary';
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';

function Cart() {
    const [lineItems, setLineItems] = useState([]);
    const [total, setTotal] = useState(0);

        const fetchCheckout = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await fetch('http://localhost:3000/api/cart/checkout', { headers });
                if (!res.ok) return;
                const data = await res.json();
                setLineItems(data.lineItems || []);
                setTotal(data.total || 0);
            } catch (e) {
                console.error('Failed to fetch cart checkout', e);
            }
        };

    useEffect(() => { fetchCheckout(); }, []);

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
                        {lineItems.length ? lineItems.map(li => (
                            <CartProduct key={li.productId} lineItem={li} onChange={fetchCheckout} />
                        )) : (
                            <p className="text-gray-600">Your cart is empty</p>
                        )}
                    </div>
                    <div className="flex-1 md:max-w-xs w-full md:sticky md:top-24">
                        <CartSummary total={total} />
                    </div>
                </motion.div>
        </>
    );
}

export default Cart;