import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";

const Scanner = () => {
  const backend_url = "http://localhost:8004";

  const [showModal, setShowModal] = useState(false);
  const [updated, setUpdated] = useState<any>(null);
  const [scannedList, setScannedList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const lastScanRef = useRef<string | null>(null);
  const scanLock = useRef(false);

  // ✅ Handle QR scan
  const handleScan = async (decodedText: string) => {
    if (scanLock.current || !decodedText) return;
    scanLock.current = true;

    try {
      const bookingData = JSON.parse(decodedText);

      if (lastScanRef.current === bookingData.bookingId) return;
      lastScanRef.current = bookingData.bookingId;

      setLoading(true);

      let fetchedData = bookingData;
      try {
        const res = await axios.get(`${backend_url}/api/bookingid/${bookingData.bookingId}`);
        fetchedData = res.data.data;
      } catch (err) {
        console.error("Backend fetch failed, using QR data:", err);
      } finally {
        setUpdated(fetchedData);
        setLoading(false);
        setShowModal(true);
      }

      // ✅ Update or add to scanned list (with real status)
      setScannedList((prev) => {
        const exists = prev.find((item) => item.bookingId === fetchedData.bookingId);
        if (exists) {
          // update existing entry
          return prev.map((item) =>
            item.bookingId === fetchedData.bookingId
              ? { ...item, paymentStatus: fetchedData.paymentStatus }
              : item
          );
        }
        // add new entry at top
        return [{ ...fetchedData }, ...prev.slice(0, 29)];
      });

      toast.success(`✅ Scanned: ${bookingData.bookingId}`);
    } catch (err) {
      console.error(err);
      toast.error("Invalid QR code format!");
    } finally {
      setTimeout(() => (scanLock.current = false), 300);
      setTimeout(() => (lastScanRef.current = null), 500);
    }
  };

  // ✅ Initialize scanner
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 20, qrbox: 250, rememberLastUsedCamera: true, aspectRatio: 1.0 },
      false
    );

    scanner.render(
      (decodedText) => handleScan(decodedText),
      (error) => {
        if (!error.includes("NotFoundException")) {
          console.warn(error);
        }
      }
    );

    return () => {
      scanner.clear().catch((err) => console.error("Cleanup error:", err));
    };
  }, []);

  const displayData = updated;

  return (
    <div className="p-4 max-w-md mx-auto min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
        Ultra-Fast QR Scanner 🚀
      </h1>

      {/* Camera view */}
      <div id="reader" className="rounded-lg shadow-md overflow-hidden" style={{ width: "100%" }}></div>

      {loading && (
        <p className="text-center text-sm mt-2 text-blue-600 animate-pulse">
          Verifying ticket...
        </p>
      )}

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md w-full p-4 max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600 text-xl">
              <CheckCircle2 className="h-6 w-6" /> Ticket Verified
            </DialogTitle>
          </DialogHeader>

          {displayData && (
            <div className="mt-4 space-y-4 max-h-[65vh] overflow-y-auto px-2 sm:px-4">
              {/* Booking Info */}
              <div className="bg-blue-50 border-l-4 border-blue-500 px-4 py-2 rounded-md shadow-sm flex justify-between items-center">
                <span className="font-semibold text-blue-800">Booking ID:</span>
                <span className="font-bold text-blue-900">{displayData.bookingId}</span>
              </div>

              {/* Ticket details */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                {[
                  ["Name", displayData.name],
                  ["Email", displayData.email],
                  ["Movie", displayData.movieName],
                  ["Date", new Date(displayData.date).toLocaleDateString()],
                  ["Timing", displayData.timing],
                  ["Ticket Type", displayData.ticketType],
                  ["Adult", displayData.adult],
                  ["Kids", displayData.kids],
                  ["Seats", displayData.seatNumbers?.join(", ")],
                  ["Total Seats", displayData.totalSeatsSelected],
                  ["Total Amount", `SEK${displayData.totalAmount}`],
                ].map(([label, value], i) => (
                  <div key={i} className="p-2 bg-gray-50 rounded-md shadow-sm">
                    <span className="text-gray-600">{label}</span>
                    <p className="font-semibold text-gray-800">{value}</p>
                  </div>
                ))}

                {/* Payment Section */}
                <div className="p-2 bg-gray-50 rounded-md shadow-sm col-span-2 flex items-center justify-between">
                  <div>
                    <span className="text-gray-600">Payment Status</span>
                    <p
                      className={`font-bold ${
                        displayData.paymentStatus === "paid"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {displayData.paymentStatus?.toUpperCase()}
                    </p>
                  </div>

                  {displayData.paymentStatus === "pending" && (
                    (() => {
                      const storedCollectorType = localStorage.getItem("collectorType") || "";
                      const collectorId = localStorage.getItem("id") || "";
                      const isAuthorized = storedCollectorType === displayData.ticketType;

                      // ✅ If collector type matches ticket → show Mark as Paid
                      if (isAuthorized) {
                        return (
                          <Button
                            className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 transition"
                            onClick={async () => {
                              try {
                                await axios.put(
                                  `${backend_url}/dashboard/booking/${displayData.bookingId}/status`,
                                  {
                                    paymentStatus: "paid",
                                    collectorType: storedCollectorType,
                                    collectorId,
                                  }
                                );

                                const newData = { ...displayData, paymentStatus: "paid" };
                                setUpdated(newData);

                                // ✅ Update scanned list live
                                setScannedList((prev) =>
                                  prev.map((item) =>
                                    item.bookingId === newData.bookingId
                                      ? { ...item, paymentStatus: "paid" }
                                      : item
                                  )
                                );

                                toast.success("✅ Payment marked as PAID!");
                              } catch (err) {
                                console.error(err);
                                toast.error("❌ Failed to update payment!");
                              }
                            }}
                          >
                            <CheckCircle2 className="w-5 h-5" /> Mark as Paid
                          </Button>
                        );
                      }

                      // ❌ Otherwise, show Change Collector Type
                      return (
                        <Button
                          className="bg-red-600 text-white hover:bg-red-700 flex items-center gap-2 transition"
                          onClick={async () => {
                            try {
                              const res = await axios.put(
                                `${backend_url}/collectors/changecollector`,
                                {
                                  bookingid: displayData.bookingId,
                                  collector: storedCollectorType,
                                }
                              );

                              setUpdated((prev) => ({
                                ...prev,
                                collectorType: res.data.updatedBooking.collectorType,
                                ticketType: res.data.updatedBooking.ticketType,
                                totalAmount: res.data.updatedBooking.totalAmount,
                              }));

                              toast.success("✅ Collector & Ticket type updated!");
                            } catch (err) {
                              console.error(err);
                              toast.error("❌ Failed to change collector type!");
                            }
                          }}
                        >
                          Change Collector Type
                        </Button>
                      );
                    })()
                  )}
                </div>
              </div>

              {/* Close Button */}
              <Button
                onClick={() => setShowModal(false)}
                className="w-full mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ✅ Scanned History */}
      <div className="mt-4 max-h-64 overflow-y-auto border rounded-md p-2 bg-white shadow-sm">
        {scannedList.map((data, idx) => (
          <div
            key={idx}
            className="p-2 border-b last:border-b-0 flex justify-between items-center"
          >
            <div>
              <span className="font-bold">{data.bookingId}</span> - {data.name}
            </div>
            <span
              className={`font-semibold ${
                data.paymentStatus === "paid" ? "text-green-600" : "text-red-600"
              }`}
            >
              {data.paymentStatus?.toUpperCase() || "PENDING"}
            </span>
          </div>
        ))}

        {scannedList.length === 0 && (
          <p className="text-center text-gray-500 text-sm">No scanned tickets yet.</p>
        )}
      </div>
    </div>
  );
};

export default Scanner;
