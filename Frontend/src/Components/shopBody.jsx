import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ShopProductCard from '../UI/shopProductCard';
import { useNavigate } from 'react-router-dom';

function ShopBody() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        // handle error
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex justify-center  min-h-screen p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl gap-8">
        {products.map((product) => (
          <motion.div
            key={product._id || product.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ShopProductCard
              species={product.species || ''}
              title={product.name || product.title}
              image={product.image}
              images={product.images}
              description={product.description}
              price={product.price}
              specialPrice={product.specialPrice}
              stock={typeof product.stock === 'number' ? (product.stock > 0 ? 'In Stock' : 'Out of Stock') : 'Out of Stock'}
              onClick={() => {
                const p = { ...product };
                if (!p.images || !p.images.length) {
                  p.images = p.image ? [p.image] : [];
                }
                navigate('/productPage', { state: { product: p } });
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ShopBody;