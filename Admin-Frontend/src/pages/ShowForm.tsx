"use client";
import React from "react";

interface ShowPrices {
  adult: string;
  kids: string;
}

interface Show {
  date: string;
  time: string;
  prices: {
    online: ShowPrices;
    videoSpeed: ShowPrices;
    others: ShowPrices;
  };
}

interface ShowFormProps {
  shows: Show[];
  onAddShow: () => void;
  onShowChange: (
    index: number,
    field: "date" | "time" | "prices",
    method: keyof Show["prices"] | null,
    type: keyof ShowPrices | null,
    value: string
  ) => void;
}

const ShowForm: React.FC<ShowFormProps> = ({ shows, onAddShow, onShowChange }) => {
  return (
    <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 shadow-md">
      <label className="font-semibold text-lg mb-3 block">Add Show Timings</label>

      {shows.map((show, idx) => (
        <div key={idx} className="border p-4 rounded mb-4 bg-white space-y-3">
          {/* Date Input */}
          <div>
            <label className="text-sm font-medium mb-1 block">Date</label>
            <input
              type="date"
              value={show.date}
              onChange={(e) => onShowChange(idx, "date", null, null, e.target.value)}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          {/* Time Input */}
          <div>
            <label className="text-sm font-medium mb-1 block">Time</label>
            <input
              type="time"
              value={show.time}
              onChange={(e) => onShowChange(idx, "time", null, null, e.target.value)}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          {/* Prices Section */}
          <div>
            <label className="text-sm font-semibold block mb-2">Prices</label>
            <div className="grid grid-cols-3 gap-3">
              {(["online", "videoSpeed", "others"] as const).map((method) => (
                <div key={method} className="border rounded p-2 space-y-2">
                  <p className="font-medium capitalize text-center bg-gray-100 p-1 rounded">
                    {method}
                  </p>

                  <input
                    type="text"
                    placeholder="Adult Price"
                    value={show.prices[method].adult}
                    onChange={(e) =>
                      onShowChange(idx, "prices", method, "adult", e.target.value)
                    }
                    className="border p-1 w-full rounded"
                    required
                  />

                  <input
                    type="text"
                    placeholder="Kids Price"
                    value={show.prices[method].kids}
                    onChange={(e) =>
                      onShowChange(idx, "prices", method, "kids", e.target.value)
                    }
                    className="border p-1 w-full rounded"
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Add Show Button */}
      <button
        type="button"
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-all"
        onClick={onAddShow}
      >
        + Add Show
      </button>
    </div>
  );
};

export default ShowForm;
