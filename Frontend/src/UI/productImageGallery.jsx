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
        <div className="mb-2 overflow-hidden rounded-xl shadow-sm w-[320px] sm:w-[520px] h-[240px] sm:h-[360px] mx-auto">
          <img
            src={imgs[activeIndex]}
            alt={`gallery image ${activeIndex + 1}`}
            className="w-full h-full object-cover object-center"
          />
        </div>
  <div className="mt-3 w-[320px] sm:w-[520px] mx-auto flex gap-3">
          {imgs.map((src, idx) => (
            <div
              key={idx}
              onClick={() => setActiveIndex(idx)}
              aria-label={`show image ${idx + 1}`}
              className={`m-0 overflow-hidden rounded-lg transition-shadow duration-150 flex-1 bg-transparent border-0 appearance-none outline-none focus:outline-none leading-none select-none min-w-0 min-h-0 cursor-pointer ${
                activeIndex === idx ? 'ring-2 ring-[#8B4513]' : 'ring-0'
              } h-[50px] sm:h-[60px]`}>
              <div
                role="img"
                aria-label={`thumbnail-${idx + 1}`}
                className="w-full h-full bg-center bg-cover block filter hover:brightness-80 transition duration-150"
                style={{ backgroundImage: `url(${src})` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductImageGallery;