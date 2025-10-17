import React from "react";

interface Props {
  seatLayoutSets: number[][];
  bookedSeats: number[];
  selectedSeats: number[];
  onSeatClick: (seatNumber: number) => void;
}

const SeatLayout: React.FC<Props> = ({ seatLayoutSets, bookedSeats, selectedSeats, onSeatClick }) => {
  // We'll calculate seat numbers fresh on each render
  let seatCounter = 1;

  const getSeatColorClass = (seatNumber: number) => {
    if (bookedSeats.includes(seatNumber)) return "bg-red-600";
    if (selectedSeats.includes(seatNumber)) return "bg-green-600";
    return "bg-gray-300";
  };

  return (
    <div className="overflow-x-auto w-full">
      <div className="inline-block min-w-max px-1 sm:px-2 space-y-2">
        {seatLayoutSets.map((set, setIndex) => {
          const maxCols = Math.max(...set);
          const previousRows = seatLayoutSets.slice(0, setIndex).reduce((acc, s) => acc + s.length, 0);

          return set.map((cols, rowIndex) => {
            const rowNumber = previousRows + rowIndex + 1;
            return (
              <div key={`set${setIndex}-${rowIndex}`} className="flex justify-center items-center gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground font-bold w-6 sm:w-8 text-right">{rowNumber}</span>

                {Array.from({ length: maxCols }, (_, seatIndex) => {
                  if (
                    seatIndex < Math.floor((maxCols - cols) / 2) ||
                    seatIndex >= Math.floor((maxCols - cols) / 2) + cols
                  ) {
                    return <div key={`empty-${setIndex}-${rowIndex}-${seatIndex}`} className="w-6 sm:w-8 h-6 sm:h-8" />;
                  }

                  const seatNumber = seatCounter++;
                  return (
                    <button
                      key={seatNumber}
                      onClick={() => onSeatClick(seatNumber)}
                      className={`w-6 sm:w-8 h-6 sm:h-8 text-[9px] sm:text-[11px] rounded ${getSeatColorClass(seatNumber)} hover:opacity-80 transition-all duration-200 font-bold text-white flex items-center justify-center shadow`}
                      disabled={bookedSeats.includes(seatNumber)}
                    >
                      {seatNumber}
                    </button>
                  );
                })}

                <span className="text-xs sm:text-sm text-muted-foreground font-bold w-6 sm:w-8 text-left">{rowNumber}</span>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};

export default SeatLayout;
