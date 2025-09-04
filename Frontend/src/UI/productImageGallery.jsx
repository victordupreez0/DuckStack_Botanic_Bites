import React, { useState, useEffect } from "react";

const ProductImageGallery = ({ imagesProp }) => {
  const defaultImgs = [
    '/vite.svg',
    'https://blocks.astratic.com/img/general-img-landscape.png',
    'https://blocks.astratic.com/img/general-img-square.png',
    'https://blocks.astratic.com/img/user-img-big.png',
  ];
  const normalize = (src) => {
    if (!src) return null;
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
    return s;
  };
  const imgs = (imagesProp && imagesProp.length) ? imagesProp.map(normalize).filter(Boolean) : defaultImgs;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Preload images
    imgs.forEach(src => {
      const preload = new Image();
      preload.src = src;
    });
  }, [imgs]);

  return (
    <section className="bg-white py-6">
      <div className="container mx-auto">
        <div className="mb-2 overflow-hidden rounded-xl w-[320px] sm:w-[520px] h-[240px] sm:h-[360px]">
          <img
            src={imgs[activeIndex]}
            alt={`gallery image ${activeIndex + 1}`}
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="flex gap-2">
          {imgs.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`overflow-hidden rounded-lg border ${
                activeIndex === idx ? 'border-black' : 'border-transparent'
              } w-[60px] sm:w-[100px] h-[50px] sm:h-[60px]`}
            >
              <img src={src} alt={`thumbnail-${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductImageGallery;