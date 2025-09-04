import React from "react";

const ProductCard = ({ title, image, images, description, price, stock }) => {
  const normalize = (src) => {
    if (!src) return null;
    // if it's an object with original/thumb fields
    if (typeof src === 'object') {
      if (src.original) return normalize(src.original);
      if (src.thumb) return normalize(src.thumb);
      return null;
    }
    let s = String(src).trim();
    if (!s) return null;
    if (s.startsWith('http://') || s.startsWith('https://')) return s;
    if (s.startsWith('/uploads')) return `http://localhost:3000${s}`;
    if (s.startsWith('uploads/')) return `http://localhost:3000/${s}`;
    // other relative paths - try prefixing as fallback
    return s;
  };
  return (
    <div className="card rounded-lg w-96 shadow-sm">
      <figure>
        <img
          src={normalize(images && images[0] ? images[0] : image)}
          alt={title}
        />
      </figure>
      <div className="card-body rounded-bl-xl rounded-br-xl text-black">
        <h2 className="card-title">{title}</h2>
        <p className="text-left">{description}</p>
        {typeof stock === 'number' && stock > 0 && (
          <span className="text-green-600 font-semibold">In Stock</span>
        )}
        <div className="card-actions justify-between items-center">
          <span className="font-bold text-lg">{price}</span>
          <button className="btn bg-black text-white border-none focus:outline-none focus:ring-0">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;