import React from "react";

interface Seat {
  seat: number;
  row: number;
}

interface Props {
  seatLayoutSets: number[][]; // each array represents how many seats per row
  bookedSeats: Seat[];
  selectedSeats: Seat[];
  onSeatClick: (seatNumber: number, rowNumber: number) => void;
  getSeatColor: (seatNumber: number, rowNumber: number) => string;
}

const SeatLayout: React.FC<Props> = ({
  seatLayoutSets,
  bookedSeats,
  selectedSeats,
  onSeatClick,
  getSeatColor,
}) => {
  let seatCounter = 1;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Scrollable Seat Layout */}
      <div className="w-full overflow-x-auto">
        <div className="inline-flex flex-col items-center gap-3 px-4 min-w-max">
          {seatLayoutSets.map((row, rowIndex) => {
            const totalSeatsInRow = row[0];

            return (
              <div
                key={rowIndex}
                className="flex justify-center items-center gap-1.5 sm:gap-2"
              >
                <span className="text-xs sm:text-sm text-gray-400 font-bold w-5 sm:w-6 text-right">
                  {rowIndex + 1}
                </span>

                {Array.from({ length: totalSeatsInRow }).map((_, seatIdx) => {
                  const seatNumber = seatCounter++;
                  const isSelected = selectedSeats.some(
                    (s) => s.seat === seatNumber && s.row === rowIndex + 1
                  );

                  // ✅ Get color from parent function
                  const seatColor = getSeatColor(seatNumber, rowIndex + 1);

                  return (
                    <button
                      key={seatNumber}
                      onClick={() => onSeatClick(seatNumber, rowIndex + 1)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded text-[10px] sm:text-[12px] font-bold text-white
                        ${seatColor || "bg-gray-300 hover:bg-gray-400"}
                        transition-all duration-200 transform ${
                          isSelected ? "scale-110" : "scale-100"
                        }`}
                    >
                      {seatNumber}
                    </button>
                  );
                })}

                <span className="text-xs sm:text-sm text-gray-400 font-bold w-5 sm:w-6 text-left">
                  {rowIndex + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex space-x-4 mt-8 text-xs sm:text-sm text-gray-300">
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-gray-300 rounded-sm border" />
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-red-500 rounded-sm border" />
          <span>Unpaid</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-green-500 rounded-sm border" />
          <span>Paid</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-yellow-400 rounded-sm border" />
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
