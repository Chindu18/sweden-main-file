// "use client";
// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { X } from "lucide-react";
// import {  backend_url } from "@/config"

//   const backend= backend_url;


// interface SeatBlockerProps {
//   onClose: () => void;
//   backendUrl: string;
// }

// const SeatBlocker: React.FC<SeatBlockerProps> = ({ onClose, backendUrl }) => {
//   // Define seat layout (each number = seats per row)
//   const seatLayoutSets = [
//     [19, 19, 21, 21, 21, 21, 21, 21],
//     [19, 19, 19, 19, 19, 19, 19, 19, 19],
//     [7],
//   ];

//   const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
//   const [blockedSeats, setBlockedSeats] = useState<number[]>([]);
//   const seatNumberRef = useRef(1); // ✅ Keeps seat numbering stable

//   // Toggle seat selection
//   const toggleSeat = (seat: number) => {
//     setSelectedSeats((prev) =>
//       prev.includes(seat)
//         ? prev.filter((s) => s !== seat)
//         : [...prev, seat]
//     );
//   };

//   // Get color for each seat
//   const getSeatColor = (seat: number) => {
//     if (blockedSeats.includes(seat)) return "bg-gray-500"; // blocked
//     if (selectedSeats.includes(seat)) return "bg-red-600"; // selected
//     return "bg-green-600"; // available
//   };

//   // Fetch blocked seats
//   const getBlockedSeats = async () => {
//     try {
//       const res = await axios.get(`${backend}/seats/blocked`);
//       setBlockedSeats(res.data?.blockedseats || []);
//     } catch (err) {
//       console.error("Error fetching blocked seats:", err);
//     }
//   };

//   // Block selected seats
//   const saveBlockedSeats = async () => {
//     if (!selectedSeats.length) return alert("Select seats to block!");
//     try {
//       await axios.post(`${backend}/seats/block`, {
//         blockedseats: selectedSeats,
//       });
//       alert("✅ Seats blocked successfully!");
//       setSelectedSeats([]);
//       await getBlockedSeats();
//     } catch (err) {
//       console.error(err);
//       alert("Error blocking seats!");
//     }
//   };

//   // Unblock selected seats
//   const unblockSeats = async () => {
//     if (!selectedSeats.length) return alert("Select seats to unblock!");
//     try {
//       await axios.put(`${backend}/seats/unblock`, {
//         seatNumbers: selectedSeats,
//       });
//       alert("✅ Seats unblocked successfully!");
//       setSelectedSeats([]);
//       await getBlockedSeats();
//     } catch (err) {
//       console.error(err);
//       alert("Error unblocking seats!");
//     }
//   };

//   useEffect(() => {
//     getBlockedSeats();
//   }, []);

//   // Reset seat numbering once
//   seatNumberRef.current = 1;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl p-6 w-full max-w-3xl relative max-h-[90vh] overflow-auto shadow-xl">
//         <button className="absolute top-2 right-2 bg-red-900" onClick={onClose}>
//           <X />
//         </button>

//         <h2 className="text-2xl font-bold mb-4 text-center text-black">🎟 Block / Unblock Seats</h2>

//         {/* Seat layout */}
//         <div className="overflow-x-auto w-full">
//           <div className="inline-block min-w-max px-2 space-y-2">
//             {seatLayoutSets.map((set, setIndex) => {
//               const maxCols = Math.max(...set);
//               const previousRows = seatLayoutSets
//                 .slice(0, setIndex)
//                 .reduce((acc, prevSet) => acc + prevSet.length, 0);

//              return set.map((cols, rowIndex) => {
//   const rowNumber = previousRows + rowIndex + 1;


//                 return (
//                   <div
//                     key={`set${setIndex}-${rowIndex}`}
//                     className="flex justify-center items-center gap-2 mb-2"
//                   >
//                     <span className="w-6 text-right font-bold">{rowNumber}</span>

//                     {Array.from({ length: maxCols }, (_, seatIndex) => {
//                       if (
//                         seatIndex < Math.floor((maxCols - cols) / 2) ||
//                         seatIndex >= Math.floor((maxCols - cols) / 2) + cols
//                       ) {
//                         return <div key={`empty-${seatIndex}`} className="w-6 h-6" />;
//                       }

//                       const seatNumber = seatNumberRef.current++;

//                       return (
//                         <button
//                           key={seatNumber}
//                           onClick={() => toggleSeat(seatNumber)}
//                           className={`w-6 h-6 rounded ${getSeatColor(
//                             seatNumber
//                           )} text-white text-xs`}
//                         >
//                           {seatNumber}
//                         </button>
//                       );
//                     })}

//                     <span className="w-6 text-left font-bold">{rowNumber}</span>
//                   </div>
//                 );
//               });
//             })}
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-between items-center mt-4 flex-wrap gap-4 text-black">
//           <div>
//             <strong>Selected:</strong> {selectedSeats.join(", ") || "None"}
//           </div>
//           <div className="flex gap-2">
//             <button
//               className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
//               onClick={saveBlockedSeats}
//             >
//               Block
//             </button>
//             <button
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
//               onClick={unblockSeats}
//             >
//               Unblock
//             </button>
//           </div>
//         </div>

//         {/* Legend */}
//         <div className="mt-4 flex justify-center gap-4 text-sm text-gray-700">
//           <div className="flex items-center gap-1">
//             <div className="w-4 h-4 bg-green-600 rounded" /> Available
//           </div>
//           <div className="flex items-center gap-1">
//             <div className="w-4 h-4 bg-red-600 rounded" /> Selected
//           </div>
//           <div className="flex items-center gap-1">
//             <div className="w-4 h-4 bg-gray-500 rounded" /> Blocked
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SeatBlocker;



"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { backend_url } from "@/config";

const backend = backend_url;

interface SeatBlockerProps {
  onClose: () => void;
  backendUrl: string;
}

const SeatBlocker: React.FC<SeatBlockerProps> = ({ onClose, backendUrl }) => {
  // 🎭 Seat layout (rows with number of seats)
  const seatLayoutSets = [
    [19],
    [19],
    [21],
    [21],
    [21],
    [21],
    [21],
    [21],
    [19],
    [19],
    [19],
    [19],
    [19],
    [19],
    [19],
    [19],
    [19],
    [7],
  ];

  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [blockedSeats, setBlockedSeats] = useState<number[]>([]);
  const seatNumberRef = useRef(1); // Keeps seat numbering consistent

  // ✅ Toggle selection
  const toggleSeat = (seat: number) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  // 🎨 Seat color logic
  const getSeatColor = (seat: number) => {
    if (blockedSeats.includes(seat)) return "bg-gray-500 cursor-not-allowed";
    if (selectedSeats.includes(seat)) return "bg-green-500";
    return "bg-gray-300 hover:bg-gray-400";
  };

  // 🚀 Fetch blocked seats
  const getBlockedSeats = async () => {
    try {
      const res = await axios.get(`${backend}/seats/blocked`);
      setBlockedSeats(res.data?.blockedseats || []);
    } catch (err) {
      console.error("Error fetching blocked seats:", err);
    }
  };

  // 🔒 Block selected seats
  const saveBlockedSeats = async () => {
    if (!selectedSeats.length) return alert("Select seats to block!");
    try {
      await axios.post(`${backend}/seats/block`, {
        blockedseats: selectedSeats,
      });
      alert("✅ Seats blocked successfully!");
      setSelectedSeats([]);
      await getBlockedSeats();
    } catch (err) {
      console.error(err);
      alert("Error blocking seats!");
    }
  };

  // 🔓 Unblock seats
  const unblockSeats = async () => {
    if (!selectedSeats.length) return alert("Select seats to unblock!");
    try {
      await axios.put(`${backend}/seats/unblock`, {
        seatNumbers: selectedSeats,
      });
      alert("✅ Seats unblocked successfully!");
      setSelectedSeats([]);
      await getBlockedSeats();
    } catch (err) {
      console.error(err);
      alert("Error unblocking seats!");
    }
  };

  useEffect(() => {
    getBlockedSeats();
  }, []);

  seatNumberRef.current = 1; // reset numbering

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl relative max-h-[90vh] overflow-auto shadow-xl">
        <button
          className="absolute top-2 right-2 bg-red-900 text-white rounded p-1"
          onClick={onClose}
        >
          <X />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          🎟 Block / Unblock Seats
        </h2>

        {/* 🎬 Seat layout (new design) */}
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="w-full overflow-x-auto">
            <div className="inline-flex flex-col items-center gap-3 px-4 min-w-max">
              {seatLayoutSets.map((row, rowIndex) => {
                const totalSeatsInRow = row[0];
                const isGapRow = rowIndex === 7; // gap after 8th row
                const isLastRow = rowIndex === seatLayoutSets.length - 1;

                return (
                  <div key={rowIndex} className="w-full">
                    <div
                      className={`flex items-center gap-1.5 sm:gap-2 w-full ${
                        isLastRow ? "justify-start ps-10" : "justify-center"
                      }`}
                    >
                      {/* Row number left */}
                      <span className="text-xs sm:text-sm text-gray-500 font-bold w-5 sm:w-6 text-right">
                        {rowIndex + 1}
                      </span>

                      {Array.from({ length: totalSeatsInRow }).map((_, seatIdx) => {
                        const seatNumber = seatNumberRef.current++;
                        const seatColor = getSeatColor(seatNumber);

                        return (
                          <button
                            key={seatNumber}
                            onClick={() => toggleSeat(seatNumber)}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded text-[10px] sm:text-[12px] font-bold text-white ${seatColor} transition-all duration-200 transform ${
                              selectedSeats.includes(seatNumber)
                                ? "scale-110"
                                : "scale-100"
                            }`}
                          >
                            {seatNumber}
                          </button>
                        );
                      })}

                      {/* Row number right */}
                      <span className="text-xs sm:text-sm text-gray-500 font-bold w-5 sm:w-6 text-left">
                        {rowIndex + 1}
                      </span>
                    </div>

                    {/* gap between sections */}
                    {isGapRow && <div className="h-6 sm:h-8 w-full" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 🎛 Control Buttons */}
        <div className="flex justify-between items-center mt-4 flex-wrap gap-4 text-black">
          <div>
            <strong>Selected:</strong> {selectedSeats.join(", ") || "None"}
          </div>
          <div className="flex gap-2">
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              onClick={saveBlockedSeats}
            >
              Block
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              onClick={unblockSeats}
            >
              Unblock
            </button>
          </div>
        </div>

        {/* 🧾 Legend */}
        <div className="mt-4 flex justify-center gap-6 text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-300 rounded-sm border" /> Available
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-500 rounded-sm border" /> Selected
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-500 rounded-sm border" /> Blocked
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatBlocker;