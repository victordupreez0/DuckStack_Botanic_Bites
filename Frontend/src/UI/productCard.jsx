import React from "react";

const ProductCard = ({ title, image, images, description, price, specialPrice, stock }) => {
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
  const truncateWords = (text, wordLimit = 30) => {
    if (!text) return '';
    const words = String(text).split(/\s+/).filter(Boolean);
    if (words.length <= wordLimit) return words.join(' ');
    return words.slice(0, wordLimit).join(' ') + '...';
  };
  return (
    <div className="card rounded-lg w-96 shadow-sm">
      <figure>
        <img
          src={normalize(images && images[0] ? images[0] : image)}
          alt={title}
        />
      </figure>
      <div className="card-body rounded-bl-xlrounded-br-xl text-black">
        <h2 className="card-title ">{title}</h2>
  <p className="text-left">{truncateWords(description, 30)}</p>
        {typeof stock === 'number' && stock > 0 && (
          <span className="text-green-600 font-semibold">In Stock</span>
        )}
        <div className="card-actions justify-between items-center">
          <div className="text-lg font-bold flex items-baseline gap-3">
            {specialPrice ? (
              <>
                <span className="text-lg text-black font-extrabold">{typeof specialPrice === 'number' ? `R${specialPrice}` : specialPrice}</span>
                  <span className="text-sm text-gray-500 line-through">{typeof price === 'number' ? `R${price}` : price}</span>
              </>
            ) : (
              <span className="text-lg font-bold">{typeof price === 'number' ? `R${price}` : price}</span>
            )}
          </div>

          <button className="btn bg-black text-white border-none focus:outline-none focus:ring-0">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;