import React from "react";

const ProductCard = ({ title, image, description, price }) => {
  return (
    <div className="card rounded-lg w-96 shadow-sm">
      <figure>
        <img
          src={image}
          alt={title}
        />
      </figure>
      <div className="card-body rounded-bl-xl rounded-br-xl text-black">
        <h2 className="card-title">{title}</h2>
        <p className="text-left">{description}</p>
        <div className="card-actions justify-between items-center">
          <span className="font-bold text-lg">{price}</span>
          <button className="btn bg-black border-none focus:outline-none focus:ring-0">
  Buy Now
</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;