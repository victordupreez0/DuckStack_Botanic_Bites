import React from "react";

const ShopProductCard = ({ species, title, image, description, price, stock }) => {
  return (
    <div className="w-full max-w-sm overflow-hidden cursor-pointer">
      <img className="object-cover object-center w-full h-56" src={image} alt="avatar" />

      <div className="flex items-center px-2 py-3 bg-black">
        <h2 className="text-sm  font-light text-white">{species}</h2>
      </div>

      <div className="px-2 py-4">
        <h2 className="text-lg text-left font-semibold text-gray-800 text-black">{title}</h2>
        <p className="py-2 text-left text-gray-700 dark:text-gray-400">{description}</p>

        <div className="flex items-center mt-4 text-black dark:text-gray-200">
          <h2 className="text-xl font-bold text-black">{price}</h2>
        </div>

        <div className="flex items-center mt-4 text-black dark:text-gray-200">
          <h2 className="text-sm text-black">{stock}</h2>
        </div>
      </div>
    </div>
  );
};

export default ShopProductCard;