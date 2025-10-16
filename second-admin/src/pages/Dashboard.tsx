"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Scanner from "./Scanner";

interface CollectorStats {
  movieName: string;
  date: string;
  totalAmount: number;
}

interface CollectorType {
  _id: string;
  username: string;
  phone: string;
  email: string;
  address: string;
  collectorType: string;
  collectAmount?: number;
}

const CollectorDashboard = () => {
  const [stats, setStats] = useState<CollectorStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalSum, setTotalSum] = useState(0);

  const collectorId = localStorage.getItem("id"); // Collector ID from localStorage
  const backend_url = "https://swedenn-backend.onrender.com";

  // Fetch collector stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      if (!collectorId) return;
      setLoading(true);

      try {
        const res = await axios.get(`${backend_url}/collector/${collectorId}`);
        setStats(res.data.data || []);

        // Calculate total sum
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
  }, [collectorId]);

  return (
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
                <th className="border px-4 py-2">Total Paid Amount (₹)</th>
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

          {/* Total sum */}
          <div className="mt-4 text-right text-lg font-semibold text-green-700">
            Total Earned: ₹{totalSum}
          </div>
        </>
      )}

      <div>
        <Scanner/>
      </div>
    </div>
  );
};

export default CollectorDashboard;
