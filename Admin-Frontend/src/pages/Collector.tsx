import React, { useEffect, useState } from "react";
import axios from "axios";

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

const Collector = () => {
  const [collectors, setCollectors] = useState<CollectorType[]>([]);
  const [totalCollectors, setTotalCollectors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [grandTotal, setGrandTotal] = useState(0);

  const backend_url = "https://swedenn-backend.onrender.com";

  // Fetch all collectors first
  useEffect(() => {
    const fetchCollectors = async () => {
      try {
        const res = await axios.get(`${backend_url}/api/allcollector`);
        if (res.data.success) {
          const collectorsData: CollectorType[] = res.data.collectors;

          // For each collector, fetch their stats and calculate total amount
          const collectorsWithStats = await Promise.all(
            collectorsData.map(async (collector) => {
              try {
                const statsRes = await axios.get(`${backend_url}/api/collector/${collector._id}`);
                const stats: CollectorStats[] = statsRes.data.data || [];
                
                // Sum totalAmount for this collector
                const totalCollected = stats.reduce((acc, item) => acc + item.totalAmount, 0);
                return { ...collector, collectAmount: totalCollected };
              } catch {
                return { ...collector, collectAmount: 0 };
              }
            })
          );

          // Set collectors
          setCollectors(collectorsWithStats);
          setTotalCollectors(collectorsWithStats.length);

          // Calculate grand total collection
          const total = collectorsWithStats.reduce(
            (acc, collector) => acc + (collector.collectAmount || 0),
            0
          );
          setGrandTotal(total);
        }
      } catch (err) {
        console.error("Error fetching collectors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectors();
  }, []);

  if (loading) return <div>Loading collectors...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Total Collectors: {totalCollectors}</h1>
      <h1 className="text-2xl font-bold mb-4">Total Collection: ₹{grandTotal}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collectors.map((collector) => (
          <div
            key={collector._id}
            className="border shadow-md rounded p-4 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold">{collector.username}</h2>
            <p><strong>Phone:</strong> {collector.phone}</p>
            <p><strong>Email:</strong> {collector.email}</p>
            <p><strong>Collector ID:</strong> {collector._id}</p>
            <p><strong>Address:</strong> {collector.address}</p>
            <p><strong>Collector Type:</strong> {collector.collectorType}</p>
            <p><strong>Total Collected Amount:</strong> ₹{collector.collectAmount || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collector;
