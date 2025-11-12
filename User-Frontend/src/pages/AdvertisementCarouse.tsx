import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { backend_url } from "@/config";

const AdvertisementCarousel: React.FC = () => {
  const [ads, setAds] = useState([]);

  // ✅ Fetch products (ads) from backend
  const fetchAds = async () => {
    try {
      const res = await axios.get(`${backend_url}/products/get`);
      if (res.data.success && res.data.products.length > 0) {
        setAds(res.data.products);
      } else {
        // fallback ad (in case backend empty)
        setAds([
          {
            name: "Default Ad",
            img: "https://via.placeholder.com/400x250?text=No+Ads+Available",
          },
        ]);
      }
    } catch (err) {
      console.error("❌ Failed to fetch ads:", err);
      setAds([
        {
          name: "Default Ad",
          img: "https://via.placeholder.com/400x250?text=Error+Loading+Ads",
        },
      ]);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // ✅ Make sure there are enough items to scroll infinitely
  const repeatedAds = useMemo(() => {
    if (ads.length === 0) return [];
    const repeatCount = ads.length < 8 ? Math.ceil(16 / ads.length) : 2; // auto-duplicate if few
    return Array(repeatCount)
      .fill(ads)
      .flat();
  }, [ads]);

  return (
    <div className="w-full bg-white py-8">
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
        Our Sponsors
      </h2>

      {/* Carousel Container */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div
          className="flex w-max gap-6 animate-scroll"
          style={{
            animation: "scroll 40s linear infinite",
          }}
        >
          {repeatedAds.map((ad, i) => (
            <div key={i} className="flex-shrink-0 w-64 h-40">
              <img
                src={ad.img}
                alt={ad.name}
                className="w-full h-full object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        {/* Inline keyframes */}
        <style>
          {`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll:hover {
              animation-play-state: paused;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default AdvertisementCarousel;
