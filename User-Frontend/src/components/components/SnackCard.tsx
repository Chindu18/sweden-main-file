import React from "react";

interface SnackCardProps {
  snack: {
    _id: string;
    name: string;
    price: number;
    img: string;
  };
  addToCart: (snack: any) => void;
}

const SnackCard: React.FC<SnackCardProps> = ({ snack, addToCart }) => {
  return (
    <div
      key={snack._id}
      className="group bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={snack.img}
          alt={snack.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="p-4 text-center">
        <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
          {snack.name}
        </h4>
        <p className="text-sm text-gray-600 mt-1">₹{snack.price}</p>
        <button
          onClick={() => addToCart(snack)}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-cyan-500 hover:to-blue-600 transition-all shadow-sm hover:shadow-md"
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
};

export default SnackCard;
