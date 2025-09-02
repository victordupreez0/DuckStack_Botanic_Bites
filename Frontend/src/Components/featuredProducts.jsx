import React from "react";
import ProductCard from "../UI/productCard";
import plantsBGpng from '../assets/plantsBG.png';
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const products = [
	{
		id: 1,
		title: "Venus Flytrap",
		image: plantsBGpng,
		description: "Description",
		price: "R150"
	},
	{
		id: 2,
		title: "Sundew",
		image: plantsBGpng,
		description: "Description",
		price: "R150"
	},
	{
		id: 3,
		title: "Pitcher Plant",
		image: plantsBGpng,
		description: "Description",
		price: "R150"
	},
	{
		id: 4,
		title: "Butterwort",
		image: plantsBGpng,
		description: "Description",
		price: "R150"
	}
];

const FeaturedProducts = () => {
	return (
        <><div className="mt-20">
            <h1>Featured Products</h1>
        </div><div className="flex flex-wrap gap-6 mt-20 mb-20 justify-center">
                {products.map(product => {
                    const { ref, inView } = useInView({
                        triggerOnce: true,
                        threshold: 0.2
                    });
                    return (
                        <motion.div
                            key={product.id}
                            ref={ref}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <ProductCard
                                title={product.title}
                                image={product.image}
                                description={product.description}
                                price={product.price} />
                        </motion.div>
                    );
                })}
            </div></>
	);
};

export default FeaturedProducts;
