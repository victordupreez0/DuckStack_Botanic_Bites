import React from "react";

const ProductCard = ({ title, image, description, price }) => {
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <figure>
        <img
          src={image}
          alt={title}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p className="text-left">{description}</p>
        <div className="card-actions justify-between items-center">
          <span className="font-bold text-lg">{price}</span>
          <button className="btn bg-[#A07856] border-none focus:outline-none focus:ring-0">
  Buy Now
</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;