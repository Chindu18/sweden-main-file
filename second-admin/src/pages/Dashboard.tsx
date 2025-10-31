"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Scanner from "./Scanner";

interface CollectorStats {
  movieName: string;
  date: string;
  totalAmount: number;
}

const CollectorDashboard = () => {
  const [stats, setStats] = useState<CollectorStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalSum, setTotalSum] = useState(0);
  const [access, setAccess] = useState(localStorage.getItem("access") || "denied");

  const collectorId = localStorage.getItem("id");
  const backend_url = "http://localhost:8004";

  // Fetch collector stats only if access is allowed
  useEffect(() => {
    const fetchStats = async () => {
      if (!collectorId || access !== "allowed") return;

      setLoading(true);
      try {
        const res = await axios.get(`${backend_url}/api/collector/${collectorId}`);
        setStats(res.data.data || []);

        const sum = (res.data.data || []).reduce(
          (acc: number, item: CollectorStats) => acc + item.totalAmount,
          0
        );
        setTotalSum(sum);
      } catch (err) {
        console.error("Failed to fetch collector stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [collectorId, access]);

  // UI rendering
  if (access === "denied") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-700 mb-4">Verification Pending</h1>
        <p className="text-lg text-gray-600 max-w-md">
          Your registration has been received and is currently under review.
          Once verified by the admin, your access will be activated.  
          Please check back later.
        </p>
        <div className="mt-8 animate-pulse text-blue-500 text-xl">
          ⏳ Waiting for approval...
        </div>
      </div>
    );
  }

  return (
    <>
   
    <div className="p-6 max-w-5xl mx-auto">
     
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Collector Dashboard
      </h1>

      {loading ? (
        <p className="text-center text-blue-600">Loading stats...</p>
      ) : (
        <>
          <table className="w-full border-collapse border shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Movie</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Total Paid Amount (SEK)</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s, idx) => (
                <tr key={idx} className="even:bg-gray-50">
                  <td className="border px-4 py-2">{s.movieName}</td>
                  <td className="border px-4 py-2">
                    {new Date(s.date).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">{s.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 text-right text-lg font-semibold text-green-700">
            Total Earned: SEK {totalSum}
          </div>
        </>
      )}

      <div className="mt-6">
        <Scanner />
      </div>
    </div>
    </>
  );
};

export default CollectorDashboard;
