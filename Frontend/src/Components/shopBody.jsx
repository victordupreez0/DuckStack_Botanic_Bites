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
        let data;
        try { data = await res.json(); } catch { data = []; }
        // fetch bundles and merge so special bundles appear in shop
        try {
          const bres = await fetch('http://localhost:3000/api/bundles');
          let bundles = [];
          try { bundles = await bres.json(); } catch { bundles = []; }
          if (Array.isArray(bundles) && bundles.length) {
            // filter hidden bundles defensively (server should handle this when not showAll)
            const visibleBundles = bundles.filter(b => !(b.hidden === true || b.hidden === 'true'));
            const bp = visibleBundles.map(b => ({
              _id: b._id,
              name: b.title,
              species: 'Bundle',
              price: b.price,
              specialPrice: b.specialPrice !== undefined ? b.specialPrice : undefined,
              description: b.description,
              images: b.images || [],
              stock: (typeof b.stock === 'number') ? b.stock : (b.stock ? Number(b.stock) : 0),
              isBundle: true,
              bundleItems: b.items || [],
              specialDeal: b.specialDeal || false
            }));
            data = Array.isArray(data) ? data.concat(bp) : bp;
          }
        } catch (e) { /* ignore */ }
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