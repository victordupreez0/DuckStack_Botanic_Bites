import React, { useState, useEffect } from "react";

const images = [
  { original: "https://blocks.astratic.com/img/general-img-landscape.png", thumb: "https://blocks.astratic.com/img/general-img-landscape.png" },
  { original: "https://blocks.astratic.com/img/general-img-portrait.png", thumb: "https://blocks.astratic.com/img/general-img-portrait.png" },
  { original: "https://blocks.astratic.com/img/general-img-square.png", thumb: "https://blocks.astratic.com/img/general-img-square.png" },
  { original: "https://blocks.astratic.com/img/user-img-big.png", thumb: "https://blocks.astratic.com/img/user-img-big.png" },
];

const ProductImageGallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Preload images
    images.forEach(img => {
      const preload = new Image();
      preload.src = img.original;
    });
  }, []);

  return (
    <section className="bg-white py-20 dark:bg-dark">
      <div className="container mx-auto">
        <div className="mb-2 overflow-hidden rounded-xl w-[300px] sm:w-[500px] h-[200px] sm:h-[300px]">
          <img
            src={images[activeIndex].original}
            alt={`gallery image ${activeIndex + 1}`}
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1 w-full">
          {images.map((img, idx) => (
            <button
              key={idx} 
              onClick={() => setActiveIndex(idx)}
              className={`overflow-hidden rounded-lg border w-[60px] sm:w-[100px] h-[50px] sm:h-[60px] ${
                activeIndex === idx ? "border-primary" : "border-transparent"
              }`}
            >
              <img
                src={img.thumb}
                alt={`thumbnail-${idx + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductImageGallery;