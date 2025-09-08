import React, { useEffect, useState } from "react";
import ShopProductCard from "../UI/shopProductCard";
import plantsBGpng from '../assets/plantsBG.png';
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

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
	const [items, setItems] = useState(products);
	// deal card observer must be a top-level hook
	const { ref: dealRef, inView: dealInView } = useInView({ triggerOnce: true, threshold: 0.18 });

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const res = await fetch('http://localhost:3000/api/products?showAll=true');
				let data;
				try { data = await res.json(); } catch { data = []; }
				if (!mounted) return;
				if (Array.isArray(data) && data.length) {
					// normalize Mongo id field to _id when needed (some builds may return _id as object)
					const normalized = data.map(d => ({ ...d, _id: d && d._id && typeof d._id === 'object' ? (d._id.$oid || (d._id.toString ? d._id.toString() : String(d._id))) : d._id }));
					// also fetch bundles and merge
					try {
						const bres = await fetch('http://localhost:3000/api/bundles');
						let bundles = [];
						try { bundles = await bres.json(); } catch (e) { bundles = []; }
						if (Array.isArray(bundles) && bundles.length) {
							const bundleProducts = bundles.map(b => ({
								_id: b._id || b._id?._id || (b._id && b._id.$oid) || b._id,
								name: b.title || b.name || 'Bundle',
								species: 'Bundle',
								price: b.price || 0,
								specialPrice: b.specialPrice || undefined,
								description: b.description || '',
								images: b.images || [],
								stock: (typeof b.stock === 'number') ? b.stock : (b.stock ? Number(b.stock) : 0),
								isBundle: true,
								bundleItems: b.items || [],
								specialDeal: b.specialDeal || false
							}));
							setItems(normalized.concat(bundleProducts));
							return;
						}
					} catch (e) { /* ignore */ }
					setItems(normalized);
					return;
				}
			} catch {
				// keep defaults on error; don't throw so page doesn't go blank
			}
		})();
		return () => { mounted = false; };
	}, []);

	// Helper to get primary image and normalize uploads paths similar to ShopProductCard
	const getPrimaryImage = (p) => {
		if (!p) return plantsBGpng;
		const src = (Array.isArray(p.images) && p.images.length) ? p.images[0] : (p.image || p.images && p.images[0]);
		if (!src) return plantsBGpng;
		const s = String(src).trim();
		if (s.startsWith('http://') || s.startsWith('https://')) return s;
		if (s.startsWith('/uploads')) return `http://localhost:3000${s}`;
		if (s.startsWith('uploads/')) return `http://localhost:3000/${s}`;
		return s;
	};

	// pick deal product: prefer a product with specialDeal that is NOT marked featured
	// (featured images must only appear in the small featured cards).
	// Treat both boolean true and string 'true' as featured when excluding.
	const nonFeaturedItems = items.filter(p => p && !(p.featured === true || p.featured === 'true'));
	const dealProduct = (
		items.find(p => p && p.specialDeal && !(p.featured === true || p.featured === 'true'))
		|| (nonFeaturedItems.length ? nonFeaturedItems[nonFeaturedItems.length - 1] : null)
		|| products.find(p => p.id === 5)
		|| products[0]
	);

	// Only show featured products if at least one product is explicitly marked featured.
	// Otherwise, show the original mock defaults.
	const explicitFeatured = items.filter(p => p && (p.featured === true || p.featured === 'true'));
	let featuredSmall = [];
	if (explicitFeatured.length > 0) {
		// exclude the deal product if it appears in the same list
		const dealId = dealProduct && (dealProduct._id || dealProduct.id);
		featuredSmall = explicitFeatured.filter(p => (p._id || p.id) !== dealId).slice(0, 4);
		// if after excluding deal product we have fewer than 4, just show what we have (do not fill from non-featured)
	} else {
		// no explicit featured items — use original mock defaults
		featuredSmall = products.filter(p => p.id !== dealProduct.id).slice(0, 4);
	}

	// SmallCard component so we can use hooks per-item safely
	const SmallCard = ({ product }) => {
		const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.12 });
		return (
			<motion.div
				key={product._id || product.id}
				ref={ref}
				initial={{ opacity: 0, y: 12 }}
				animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
				transition={{ duration: 0.45, ease: "easeOut" }}
			>
				<ShopProductCard
					title={product.name || product.title}
					species={product.species}
					image={getPrimaryImage(product)}
					descriptionLimit={15}
					onClick={() => navigate('/productPage', { state: { product } })}
					images={product.images}
					description={product.description}
					price={product.price}
					specialPrice={product.specialPrice}
					stock={typeof product.stock === 'number' ? (product.stock > 0 ? 'In Stock' : 'Out of Stock') : 'Out of Stock'} />
			</motion.div>
		);
	};

	// Use the deal product's primary image for the large card (if available).
	// Note: since dealProduct excludes featured items, featured images will not
	// appear here.
	const imgSrc = getPrimaryImage(dealProduct);
	const title = dealProduct.name || dealProduct.title || 'Deal';
	const species = dealProduct.species || '';
	const navigate = useNavigate();

	return (
		<>
			<div className="my-20">
				<h2 className="text-black text-4xl md:text-5xl">Featured Products</h2>
			</div>

			<div className="mb-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
				{/* Large deal card (left) */}
				<div>
					<motion.div
						ref={dealRef}
						initial={{ opacity: 0, y: 20 }}
						animate={dealInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						className="relative overflow-hidden rounded-lg shadow-md"
					>
						<img className="object-cover w-full h-96" src={imgSrc} alt={title} />
						<div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded">Deal</div>
						<div className="bg-white p-6">
							<h3 className="text-sm text-gray-500">{species}</h3>
							<h2 className="text-3xl font-bold text-black my-2">{title}</h2>
							<p className="text-gray-700 mb-4">{dealProduct.description || ''}</p>
							<div className="flex items-center justify-between">
								<div>
									{dealProduct.specialPrice ? (
										<div className="flex items-baseline gap-3">
											<span className="text-sm text-gray-500 line-through">{typeof dealProduct.price === 'number' ? `R${dealProduct.price}` : dealProduct.price}</span>
											<span className="text-2xl font-extrabold text-black">{typeof dealProduct.specialPrice === 'number' ? `R${dealProduct.specialPrice}` : dealProduct.specialPrice}</span>
										</div>
									) : (
										<span className="text-2xl font-extrabold">{dealProduct.price}</span>
									)}
									<div className="text-sm text-gray-600">Limited time</div>
								</div>
								<button
									className="btn bg-black text-white border-none focus:outline-none focus:ring-0 px-6 py-2"
									onClick={() => navigate('/productPage', { state: { product: dealProduct } })}
								>
									Shop Deal
								</button>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Right: 2x2 small cards */}
				<div>
					<div className="grid grid-cols-2 gap-4">
						{featuredSmall.map(p => (
							<SmallCard key={p._id || p.id} product={p} />
						))}
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
