import { motion } from 'framer-motion';
import ShopProductCard from '../UI/shopProductCard';
import { useNavigate } from 'react-router-dom';


function FeaturedProducts() {
  const navigate = useNavigate();

  const products = [
    {
      species: "Dionaea muscipula",
      title: "Venus Flytrap",
      image: "https://blocks.astratic.com/img/general-img-landscape.png",
      description: "A classic carnivorous plant with jaw-like leaves that snap shut on unsuspecting insects.",
      price: "R120",
      stock: "In Stock",
    },
    {
      species: "Nepenthes alata",
      title: "Pitcher Plant",
      image: "https://blocks.astratic.com/img/general-img-landscape.png",
      description: "An exotic plant with pitcher-shaped traps that lure and digest bugs.",
      price: "R120",
      stock: "In Stock",
    },
    {
      species: "Drosera capensis",
      title: "Cape Sundew",
      image: "https://blocks.astratic.com/img/general-img-landscape.png",
      description: "A sticky-leaved beauty that glistens in the sun and traps tiny insects.",
      price: "R120",
      stock: "In Stock",
    },
    {
      species: "Sarracenia purpurea",
      title: "Purple Pitcher Plant",
      image: "https://blocks.astratic.com/img/general-img-landscape.png",
      description: "A striking pitcher plant with vibrant purple hues.",
      price: "R120",
      stock:"In Stock",
    },
    {
      species: "Pinguicula vulgaris",
      title: "Common Butterwort",
      image: "https://blocks.astratic.com/img/general-img-landscape.png",
      description: "A delicate plant with sticky leaves that trap small insects.",
      price: "R120",
      stock: "In Stock",
    },
    {
      species: "Cephalotus follicularis",
      title: "Albany Pitcher Plant",
      image: "https://blocks.astratic.com/img/general-img-landscape.png",
      description: "A unique pitcher plant native to Australia.",
      price: "R120",
      stock: "In Stock",
    },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl gap-8">
        {products.map((product) => (
          <motion.div
            key={product.species}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ShopProductCard
              species={product.species}
              title={product.title}
              image={product.image}
              description={product.description}
              price={product.price}
              stock={product.stock}
              onClick={() => navigate('/productPage', { state: { product } })}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedProducts;