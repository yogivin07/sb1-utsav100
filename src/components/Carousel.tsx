import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
  {
    id: 1,
    title: "",
    description: "",
    image: "https://uskjyykpwxgjynrvgncv.supabase.co/storage/v1/object/public/uploaded-files/2e5ffe33-ee85-45e0-ae92-fdfd1464f855/h5ee0k8r9_npd3np9th_kathav%20bldg%2010%20x%2012.jpg",
  },
  {
    id: 2,
    title: "",
    description: "",
    image: "https://uskjyykpwxgjynrvgncv.supabase.co/storage/v1/object/public/uploaded-files/95374bd2-c92a-4910-8e97-305f2a064adf/t1gqt7xpx_logo-01-01-01.jpg",
  },
  {
    id: 3,
    title: "",
    description: "",
    image: "https://uskjyykpwxgjynrvgncv.supabase.co/storage/v1/object/public/uploaded-files/2e5ffe33-ee85-45e0-ae92-fdfd1464f855/WhatsApp%20Image%202025-08-18%20at%2016.29.51_c243e11e.jpg",
  },

 
];

export default function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transform transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div className="relative h-full w-full">
            <img
              src={banner.image}
              alt={banner.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
              <h2 className="mb-4 text-5xl font-bold tracking-tight">{banner.title}</h2>
              <p className="max-w-xl text-xl">{banner.description}</p>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/50"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/50"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}