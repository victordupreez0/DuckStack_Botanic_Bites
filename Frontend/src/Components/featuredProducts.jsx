import React from "react";
import ShopProductCard from "../UI/shopProductCard";
import plantsBGpng from '../assets/plantsBG.png';
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const products = [
	{
		id: 1,
		title: "Venus Flytrap",
		species: "Carnivorous",
		image: plantsBGpng,
		description: "A classic snap trap plant, perfect for beginners.",
		price: "R150"
	},
	{
		id: 2,
		title: "Sundew",
		species: "Carnivorous",
		image: plantsBGpng,
		description: "Delicate sticky tentacles that catch tiny insects.",
		price: "R150"
	},
	{
		id: 3,
		title: "Pitcher Plant",
		species: "Carnivorous",
		image: plantsBGpng,
		description: "Tube-shaped pitchers that trap and digest prey.",
		price: "R150"
	},
	{
		id: 4,
		title: "Butterwort",
		species: "Carnivorous",
		image: plantsBGpng,
		description: "Sticky leaves that lure and digest small insects.",
		price: "R150"
	},
	// Featured deal product (big card)
	{
		id: 5,
		title: "Mega Venus Deal",
		species: "Limited Deal",
		image: plantsBGpng,
		description: "Special bundle: 3x Venus Flytraps + care guide. Limited time offer!",
		price: "R399"
	}
];

const FeaturedProducts = () => {
	// We'll use the last product as the large deal card and the first four as the small grid
	const dealProduct = products.find(p => p.id === 5) || products[0];
	const smallProducts = products.filter(p => p.id !== dealProduct.id).slice(0, 4);

	return (
		<>
			<div className="my-20">
				<h2 className="text-black text-4xl md:text-5xl">Featured Products</h2>
			</div>

			<div className="mb-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
				{/* Large deal card (left) */}
				<div>
					{(() => {
						const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
						return (
							<motion.div
								ref={ref}
								initial={{ opacity: 0, y: 20 }}
								animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
								transition={{ duration: 0.6, ease: "easeOut" }}
								className="relative overflow-hidden rounded-lg shadow-md"
							>
								<img className="object-cover w-full h-96" src={dealProduct.image} alt={dealProduct.title} />
								<div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded">Deal</div>
								<div className="bg-white p-6">
									<h3 className="text-sm text-gray-500">{dealProduct.species}</h3>
									<h2 className="text-3xl font-bold text-black my-2">{dealProduct.title}</h2>
									<p className="text-gray-700 mb-4">{(function(text){
										if(!text) return '';
										const words = String(text).split(/\s+/).filter(Boolean);
										if(words.length <= 30) return words.join(' ');
										return words.slice(0,30).join(' ') + '...';
									})(dealProduct.description)}</p>
									<div className="flex items-center justify-between">
										<div>
											{dealProduct.specialPrice ? (
												<div className="flex items-baseline gap-3">
													<span className="text-sm text-gray-500 line-through">{typeof dealProduct.price === 'number' ? `R${dealProduct.price}` : dealProduct.price}</span>
													<span className="text-2xl font-extrabold text-red-600">{typeof dealProduct.specialPrice === 'number' ? `R${dealProduct.specialPrice}` : dealProduct.specialPrice}</span>
												</div>
											) : (
												<span className="text-2xl font-extrabold">{dealProduct.price}</span>
											)}
											<div className="text-sm text-gray-600">Limited time</div>
										</div>
										<Link to="/shop">
											<button className="btn bg-black text-white border-none focus:outline-none focus:ring-0 px-6 py-2">Shop Deal</button>
										</Link>
									</div>
								</div>
							</motion.div>
						);
					})()}
				</div>

				{/* Right: 2x2 small cards */}
				<div>
					<div className="grid grid-cols-2 gap-4">
						{smallProducts.map(product => {
							const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
							return (
								<motion.div
									key={product.id}
									ref={ref}
									initial={{ opacity: 0, y: 12 }}
									animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
									transition={{ duration: 0.5, ease: "easeOut" }}
								>
									<ShopProductCard
										title={product.title}
										species={product.species}
										image={product.image}
										images={product.images}
										description={product.description}
										price={product.price}
										specialPrice={product.specialPrice}
										stock={product.stock} />
								</motion.div>
							);
						})}
					</div>
				</div>
			</div>

			<Link to="/shop">
				<button className="btn bg-black mb-10 text-white border-none focus:outline-none focus:ring-0">
					Browse Products
				</button>
			</Link>
		</>
	);
};

export default FeaturedProducts;
