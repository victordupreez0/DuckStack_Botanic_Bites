import React, { useState, useEffect } from "react";


const ProductImageGallery = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  // fallback to empty array if not provided
  const galleryImages = (images && images.length) ? images : [];

  useEffect(() => {
    galleryImages.forEach(img => {
      if (img) {
        const preload = new Image();
        preload.src = img;
      }
    });
  }, [galleryImages]);

  if (!galleryImages.length) return <div>No images available</div>;

  return (
    <section className="bg-white py-20 dark:bg-dark">
      <div className="container mx-auto">
        <div className="mb-2 overflow-hidden rounded-xl w-[300px] sm:w-[500px] h-[200px] sm:h-[300px]">
          <img
            src={galleryImages[activeIndex]}
            alt={`gallery image ${activeIndex + 1}`}
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1 w-full">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`overflow-hidden rounded-lg border w-[60px] sm:w-[100px] h-[50px] sm:h-[60px] ${
                activeIndex === idx ? "border-primary" : "border-transparent"
              }`}
            >
              <img
                src={img}
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