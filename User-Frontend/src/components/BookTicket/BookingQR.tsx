// "use client";
// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
// } from "@/components/ui/dialog";
// import { QRCodeSVG } from "qrcode.react";

// interface BookingQRProps {
//   open: boolean;
//   onClose: () => void;
//   bookingData: any;
// }

// const BookingQR: React.FC<BookingQRProps> = ({ open, onClose, bookingData }) => {
//   if (!bookingData) return null;

//   const qrCode = bookingData.qrCode;
//   const bookingId = bookingData.bookingId || bookingData.data?.bookingId;
//   const data = bookingData.data || {};

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl shadow-2xl border-0 bg-white">
//         {/* Ticket Header */}
//         <div className="flex gap-3 items-center p-4 border-b">
//           <img
//             src={data.poster || "/placeholder.svg"}
//             alt={data.movieName}
//             className="w-20 h-28 object-cover rounded-md"
//           />
//           <div className="text-left">
//             <h2 className="font-bold text-lg">{data.movieName}</h2>
//              <p className="text-sm font-medium mt-1">
//               {new Date(data.date).toLocaleDateString()} | {data.timing}
//             </p>
//             <p className="text-xs text-gray-400 mt-1">{data.theatreName || "Tamil Film Sweden"}</p>
//           </div>
//         </div>

//         {/* Ticket Middle Section */}
//         <div className="px-4 py-3 bg-gray-50 text-center text-sm text-gray-500 border-b">
//           Tap for support, details & more actions
//         </div>

//         {/* QR Section */}
//         <div className="flex flex-col items-center py-5 bg-white">
//           {qrCode ? (
//             <img
//               src={qrCode.startsWith("data:image") ? qrCode : `data:image/png;base64,${qrCode}`}
//               alt="QR Code"
//               className="w-40 h-40 rounded-lg border p-2"
//             />
//           ) : (
//             <QRCodeSVG value={bookingId || "No Booking ID"} size={160} />
//           )}

//           <p className="mt-3 text-gray-700 font-semibold">{data.screen || "SCREEN 1"}</p>
//           <p className="text-sm text-gray-500">
//             seatas - {data.seatNumbers?.join(", ") || "N/A"}
//           </p>
//           <p className="mt-2 text-xs text-gray-400">Name: {data.name}</p>
//           <p className="mt-2 text-xs text-gray-400">TotalAmount: {data.totalAmount}</p>
//           <p className="mt-2 text-xs text-gray-400">kids: {data.kids}</p>
//           <p className="mt-2 text-xs text-gray-400">Adults: {data.adult}</p>
        

//           <p className="mt-2 text-xs text-gray-400">Booking ID: {bookingId}</p>
//         </div>

//         {/* Footer */}
//         <div className="px-4 py-3 text-center text-xs text-gray-400 border-t">
//           Cancellation not available for this venue
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default BookingQR;

"use client";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";

interface BookingQRProps {
  open: boolean;
  onClose: () => void;
  bookingData: any;
}

const BookingQR: React.FC<BookingQRProps> = ({ open, onClose, bookingData }) => {
  if (!bookingData) return null;

  const qrCode = bookingData.qrCode;
  const bookingId = bookingData.bookingId || bookingData.data?.bookingId;
  const data = bookingData.data || {};

  // Format seat numbers correctly
  const formattedSeats =
    data.seatNumbers && Array.isArray(data.seatNumbers)
      ? data.seatNumbers
          .map((s: any) => `R${s.row}-S${s.seat}`)
          .join(", ")
      : "N/A";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          w-[90%] sm:w-[400px] max-w-md p-0 
          overflow-hidden rounded-2xl shadow-2xl border-0 bg-white 
          max-h-[90vh] flex flex-col
        "
      >
        {/* Scrollable Body */}
        <div className="overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-4 p-4 border-b">
            <img
              src={data.poster || "/placeholder.svg"}
              alt={data.movieName || "Movie Poster"}
              className="w-20 h-28 object-cover rounded-md"
            />
            <div className="flex-1 text-left">
              <h2 className="font-extrabold text-xl text-gray-900">
                {data.movieName || "Unknown Movie"}
              </h2>
              <p className="text-sm font-medium mt-1 text-gray-700">
                {new Date(data.date).toLocaleDateString()} | {data.timing}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {data.theatreName || "Tamil Film Sweden"}
              </p>
            </div>
          </div>

          {/* Info Line */}
          <div className="px-4 py-2 text-center text-gray-500 text-xs sm:text-sm border-b bg-gray-50">
            Tap for support or booking details
          </div>

          {/* QR + Info */}
          <div className="flex flex-col items-center py-5 px-3 bg-white text-sm">
            {qrCode ? (
              <img
                src={
                  qrCode.startsWith("data:image")
                    ? qrCode
                    : `data:image/png;base64,${qrCode}`
                }
                alt="QR Code"
                className="w-36 h-36 sm:w-40 sm:h-40 rounded-lg border p-2"
              />
            ) : (
              <QRCodeSVG value={bookingId || "No Booking ID"} size={150} />
            )}

            <div className="mt-4 text-center space-y-1">
              {/* Screen */}
              {data.screen && (
                <p className="text-gray-700 font-semibold">{data.screen}</p>
              )}

              {/* Seats */}
              <p className="text-gray-600 font-medium">
                🎟 Seats:{" "}
                <span className="text-gray-800 font-semibold">
                  {formattedSeats}
                </span>
              </p>

              {/* Total Seats */}
              {data.totalSeatsSelected && (
                <p className="text-gray-500 text-sm">
                  Total Seats:{" "}
                  <span className="font-semibold text-gray-700">
                    {data.totalSeatsSelected}
                  </span>
                </p>
              )}

              {/* Amount */}
              {data.totalAmount && (
                <p className="text-gray-600 text-sm">
                  💰 Total Amount:{" "}
                  <span className="font-semibold text-gray-800">
                    ₹{data.totalAmount}
                  </span>
                </p>
              )}

              {/* Adults & Kids */}
              {(data.adult || data.kids) && (
                <p className="text-gray-500 text-xs">
                  👨‍👩‍👧 Adults: {data.adult || 0} | Kids: {data.kids || 0}
                </p>
              )}

              {/* Name */}
              {data.name && (
                <p className="text-gray-500 text-xs">Name: {data.name}</p>
              )}

              {/* Booking ID */}
              {bookingId && (
                <p className="text-gray-300 text-[10px] mt-1">
                  Booking ID: {bookingId}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 text-center text-[11px] sm:text-xs text-gray-400 border-t bg-gray-50">
          Cancellation not available for this venue
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingQR;
