import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";

const Scanner = () => {
  const backend_url = "https://swedenn-backend.onrender.com";

  const [showModal, setShowModal] = useState(false);
  const [updated, setUpdated] = useState<any>(null);
  const [scannedList, setScannedList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [collectorType,setcollectorType]=useState('');

  const lastScanRef = useRef<string | null>(null);
  const scanLock = useRef(false);

 

  // ✅ Handle QR scan
  const handleScan = async (decodedText: string) => {
    if (scanLock.current || !decodedText) return;
    scanLock.current = true;

    try {
      const parsed = JSON.parse(decodedText);
      const bookingData = parsed;

      if (lastScanRef.current === bookingData.bookingId) return;
      lastScanRef.current = bookingData.bookingId;

      setLoading(true);

      // Fetch from backend
      try {
        const res = await axios.get(`${backend_url}/api/bookingid/${bookingData.bookingId}`);
        setUpdated(res.data.data);
      } catch (err) {
        console.error("Backend fetch failed, using QR data:", err);
        setUpdated(bookingData);
      } finally {
        setLoading(false);
        setShowModal(true);
      }

      // Add to scanned history
      setScannedList((prev) => [bookingData, ...prev.slice(0, 29)]);
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
  console.log(displayData)

  return (
    <div className="p-4 max-w-md mx-auto min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Ultra-Fast QR Scanner 🚀</h1>

      {/* Camera view */}
      <div id="reader" className="rounded-lg shadow-md overflow-hidden" style={{ width: "100%" }}></div>

      {loading && <p className="text-center text-sm mt-2 text-blue-600 animate-pulse">Verifying ticket...</p>}

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
    {/* Booking ID */}
    <div className="bg-blue-50 border-l-4 border-blue-500 px-4 py-2 rounded-md shadow-sm flex justify-between items-center">
      <span className="font-semibold text-blue-800">Booking ID:</span>
      <span className="font-bold text-blue-900">{displayData.bookingId}</span>
    </div>

    {/* Main Details */}
    <div className="grid grid-cols-2 gap-2 sm:gap-4">
      <div className="p-2 bg-gray-50 rounded-md shadow-sm">
        <span className="text-gray-600">Name</span>
        <p className="font-semibold text-gray-800">{displayData.name}</p>
      </div>

      <div className="p-2 bg-gray-50 rounded-md shadow-sm">
        <span className="text-gray-600">Email</span>
        <p className="font-semibold text-gray-800">{displayData.email}</p>
      </div>

      <div className="p-2 bg-gray-50 rounded-md shadow-sm">
        <span className="text-gray-600">Movie</span>
        <p className="font-semibold text-gray-800">{displayData.movieName}</p>
      </div>

      <div className="p-2 bg-gray-50 rounded-md shadow-sm">
        <span className="text-gray-600">Date</span>
        <p className="font-semibold text-gray-800">
          {new Date(displayData.date).toLocaleDateString()}
        </p>
      </div>

      <div className="p-2 bg-gray-50 rounded-md shadow-sm">
        <span className="text-gray-600">Timing</span>
        <p className="font-semibold text-gray-800">{displayData.timing}</p>
      </div>

      <div className="p-2 bg-gray-50 rounded-md shadow-sm">
        <span className="text-gray-600">Ticket Type</span>
        <p className="font-semibold text-gray-800">{displayData.ticketType}</p>
      </div>

      <div className="p-2 bg-gray-50 rounded-md shadow-sm">
        <span className="text-gray-600">Adult</span>
        <p className="font-semibold text-gray-800">{displayData.adult}</p>
      </div>

      <div className="p-2 bg-gray-50 rounded-md shadow-sm">
        <span className="text-gray-600">Kids</span>
        <p className="font-semibold text-gray-800">{displayData.kids}</p>
      </div>

      <div className="p-2 bg-gray-50 rounded-md shadow-sm">
        <span className="text-gray-600">Seats</span>
        <p className="font-semibold text-gray-800">
          {displayData.seatNumbers?.join(", ")}
        </p>
      </div>

      <div className="p-2 bg-gray-50 rounded-md shadow-sm">
        <span className="text-gray-600">Total Seats</span>
        <p className="font-semibold text-gray-800">
          {displayData.totalSeatsSelected}
        </p>
      </div>

      <div className="p-2 bg-gray-50 rounded-md shadow-sm">
        <span className="text-gray-600">Total Amount</span>
        <p className="font-semibold text-gray-800">₹{displayData.totalAmount}</p>
      </div>

      {/* Payment Status & Action */}
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
       <Button
  className="bg-yellow-500 text-white hover:bg-yellow-600"
  onClick={async () => {
    try {
      const collectorType = localStorage.getItem("collectorType") || '';
      const collectorId = localStorage.getItem("id") || '';

      await axios.put(
        `${backend_url}/dashboard/booking/${displayData.bookingId}/status`,
        { 
          paymentStatus: "paid",
          collectorType,
          collectorId
        }
      );

      // Update modal
      setUpdated({ ...displayData, paymentStatus: "paid" });

      // Update scanned history
      setScannedList(prev =>
        prev.map(item =>
          item.bookingId === displayData.bookingId
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
  disabled={displayData.paymentStatus === "paid"}
>
  Mark as Paid
</Button>


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

      {/* Scanned History */}
      <div className="mt-4 max-h-64 overflow-y-auto border rounded-md p-2 bg-white shadow-sm">
        {scannedList.map((data, idx) => (
          <div key={idx} className="p-2 border-b last:border-b-0">
            <span className="font-bold">{data.bookingId}</span> - {data.name} -{" "}
            <span
              className={`${
                displayData.paymentStatus === "paid" ? "text-green-600" : "text-red-600"
              }`}
            >
              {displayData.paymentStatus}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scanner;
