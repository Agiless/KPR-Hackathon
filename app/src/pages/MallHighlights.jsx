import React, { useState, useEffect } from "react";
import Slider from "react-slick"; // or Swiper if you're using it
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const highlights = [
  {
    title: "H&M",
    image: "/images/hm.jpg",
  },
  {
    title: "Food Court",
    image: "/images/foodcourt.jpg",
  },
  {
    title: "PVR Cinemas",
    image: "/images/pvr.jpg",
  },
  {
    title: "Zara",
    image: "/images/zara.png",
  },
  {
    title: "Lifestyle",
    image: "/images/lifestyle.jpg",
  },
];

const MallHighlights = () => {
  const [mounted, setMounted] = useState(false);

  // Ensure slider initializes after mount (avoids hydration bug)
  useEffect(() => {
    setMounted(true);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,          // ✅ always one slide visible
    slidesToScroll: 1,
    centerMode: true,         // ✅ centers the slide
    centerPadding: "0px",     // ✅ removes side gaps
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  if (!mounted) return null; // Wait until mounted

  return (
    <div className="w-full max-w-lg mx-auto py-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        🔥 Top 5 Highlights in Griffin Mall
      </h2>

      <Slider {...settings}>
        {highlights.map((item, idx) => (
          <div key={idx} className="px-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover" // ✅ fixed height
                loading="lazy"
              />
              
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MallHighlights;
