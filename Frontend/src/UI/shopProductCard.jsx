const ShopProductCard = ({ species, title, image, description, price, stock, onClick }) => {
  return (
    <div
      className="w-full max-w-sm overflow-hidden cursor-pointer hover:shadow-lg hover:scale-105 transition-transform duration-200"
      onClick={onClick} // this makes the card clickable
    >
      <img className="object-cover object-center w-full h-56" src={image} alt={title} />
      <div className="flex items-center px-6 py-3 bg-black">
        <h2 className="text-sm font-light text-white">{species}</h2>
      </div>
      <div className="py-4">
        <h2 className="text-lg font-semibold text-gray-800 text-black">{title}</h2>
        <p className="py-2 text-gray-700 dark:text-gray-400">{description}</p>
        <h2 className="text-xl font-bold text-black">{price}</h2>
        <h2 className="text-sm text-black">{stock}</h2>
      </div>
    </div>
  );
};

export default ShopProductCard;