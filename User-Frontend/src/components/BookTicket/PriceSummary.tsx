import React from "react";

interface Props {
  adult: number;
  kids: number;
  ticketPrice: { adult: number; kids: number };
  totalSeatsSelected: number;
  calculateTotal: () => number;
}

const PriceSummary: React.FC<Props> = ({ adult, kids, ticketPrice, totalSeatsSelected, calculateTotal }) => {
  return (
    <div className="space-y-6 border-2 border-border rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <label className="text-lg font-semibold">Adult (SEK{ticketPrice.adult})</label>
        <div className="text-lg">{adult}</div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <label className="text-lg font-semibold">Kids (SEK{ticketPrice.kids})</label>
        <div className="text-lg">{kids}</div>
      </div>

      <p className="text-lg font-semibold text-center sm:text-left">Total Seats: {totalSeatsSelected}</p>

      <div className="pt-4 border-t-2 border-border mt-4">
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-accent/10 rounded-lg gap-2 sm:gap-0">
          <span className="text-xl font-bold">Total Amount:</span>
          <span className="text-2xl font-bold text-accent">SEK{calculateTotal()}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceSummary;
