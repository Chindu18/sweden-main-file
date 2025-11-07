import React, { useEffect, useState } from "react";
import axios from "axios";
import SeatLayout from "./SeatLayout"; // your seat layout component

interface SnackItem {
  name: string;
  qty: number;
  price: number;
}

interface Seat {
  seat: number;
  row: number;
}

interface SnackOrder {
  _id: string;
  userName: string;
  userEmail: string;
  totalAmount: number;
  paymentStatus: "pending" | "paid";
  showTime: string;
  showdate: string;
  bookingId: string;
  movieName?: string;
  collectorType?: string;
  items: SnackItem[];
  seatNumbers?: Seat[];
}

const backendurl = "http://localhost:8004";

const Snacksdistrubute: React.FC = () => {
  const [ordersByMovie, setOrdersByMovie] = useState<
    Record<string, Record<string, SnackOrder[]>>
  >({});
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);


  
  // ✅ Fetch orders for today
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${backendurl}/snackdistrubute/snackOrders/today`);
        setOrdersByMovie(res.data || {});
      } catch (err) {
        console.error("Error fetching snack orders:", err);
      }
    };
    fetchOrders();
  }, []);

  // ✅ Handle seat click
  const handleSeatClick = (seatNumber: number, rowNumber: number) => {
    if (!selectedMovie || !selectedTime) return;

    const orders = ordersByMovie[selectedMovie]?.[selectedTime];
    const order = orders?.find((o) =>
      o.seatNumbers?.some((s) => s.seat === seatNumber && s.row === rowNumber)
    );

    if (order) {
      alert(
        `Seat ${seatNumber} (Row ${rowNumber})\n` +
          `Name: ${order.userName}\n` +
          `Status: ${order.paymentStatus}\n` +
          `Snacks: ${order.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}`
      );
    } else {
      alert(`Seat ${seatNumber} (Row ${rowNumber}) — No snack order`);
    }
  };

  // ✅ Get seat color (paid = green, unpaid = red)
  const getSeatColor = (seatNumber: number, rowNumber: number): string => {
    if (!selectedMovie || !selectedTime) return "";

    const orders = ordersByMovie[selectedMovie]?.[selectedTime];
    const order = orders?.find((o) =>
      o.seatNumbers?.some((s) => s.seat === seatNumber && s.row === rowNumber)
    );

    if (!order) return "";
    return order.paymentStatus === "paid" ? "bg-green-500" : "bg-red-500";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🍿 Snack Distribution Dashboard
      </h1>

      {Object.keys(ordersByMovie).length === 0 ? (
        <p className="text-gray-500">No snack orders found for today.</p>
      ) : (
        Object.keys(ordersByMovie).map((movie) => (
          <div key={movie} className="mb-12">
            {/* 🎬 Movie Section */}
            <h2 className="text-2xl font-semibold mb-3 text-blue-700 flex items-center gap-2">
              🎬 {movie}
            </h2>

            {/* Show Time Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              {Object.keys(ordersByMovie[movie]).map((time) => (
                <button
                  key={time}
                  className={`px-5 py-2 rounded-xl font-medium shadow-sm transition ${
                    selectedMovie === movie && selectedTime === time
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-300 hover:bg-blue-100"
                  }`}
                  onClick={() => {
                    setSelectedMovie(movie);
                    setSelectedTime(time);
                  }}
                >
                  {time}
                </button>
              ))}
            </div>

            {/* Seat Layout + Orders */}
            {selectedMovie === movie && selectedTime && (
              <div className="bg-white rounded-2xl p-5 shadow-md border">
                <h3 className="text-xl font-semibold mb-4">
                  {movie} — Show Time: {selectedTime}
                </h3>

                <SeatLayout
                  seatLayoutSets={[
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
                  ]}
                  bookedSeats={
                    ordersByMovie[movie][selectedTime].flatMap(
                      (o) => o.seatNumbers || []
                    )
                  }
                  selectedSeats={selectedSeats}
                  onSeatClick={handleSeatClick}
                  getSeatColor={getSeatColor}
                />

                {/* Orders List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                  {ordersByMovie[movie][selectedTime].map((order) => (
                    <div
                      key={order._id}
                      className="border rounded-2xl p-5 bg-gray-50 shadow hover:shadow-lg transition"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-lg text-gray-800">
                          {order.userName}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            order.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {order.paymentStatus.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500">{order.userEmail}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        🎟️ Booking ID: {order.bookingId}
                      </p>
                      <p className="text-sm text-gray-600">
                        Collector: <strong>{order.collectorType || "—"}</strong>
                      </p>

                      <p className="mt-3 text-sm text-gray-600">
                        Seats:{" "}
                        {order.seatNumbers && order.seatNumbers.length > 0
                          ? order.seatNumbers
                              .map((s) => `R${s.row}-S${s.seat}`)
                              .join(", ")
                          : "—"}
                      </p>

                      <div className="mt-3 border-t pt-3">
                        <h5 className="font-semibold mb-1">Snacks:</h5>
                        {order.items.map((i, idx) => (
                          <p key={idx} className="text-sm text-gray-700">
                            {i.name} × {i.qty} — ₹{i.price * i.qty}
                          </p>
                        ))}
                      </div>

                      <p className="mt-3 font-semibold text-right text-blue-700">
                        Total: ₹{order.totalAmount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Snacksdistrubute;
