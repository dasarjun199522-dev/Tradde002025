import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Helper to generate chart data from filtered stocks
function generateChartData(filteredStocks) {
  // Example: group by month and average price (replace with your real logic)
  // Here, we just use static data if no stocks, or mock a dynamic chart if stocks exist
  if (!filteredStocks || filteredStocks.length === 0) {
    return [
      { date: '2024-09', price: 1.0, trend: 1.05 },
      { date: '2024-10', price: 1.15, trend: 1.10 },
      { date: '2024-11', price: 1.4, trend: 1.15 },
      { date: '2024-12', price: 1.25, trend: 1.18 },
      { date: '2025-01', price: 1.2, trend: 1.20 },
      { date: '2025-02', price: 1.1, trend: 1.22 },
      { date: '2025-03', price: 1.0, trend: 1.23 },
      { date: '2025-04', price: 0.9, trend: 1.25 },
      { date: '2025-05', price: 0.8, trend: 1.28 },
      { date: '2025-06', price: 1.2, trend: 1.35 },
      { date: '2025-07', price: 1.6, trend: 1.45 },
    ];
  }
  // Example: create a simple chart with price = index/length, trend = price + 0.1
  return filteredStocks.map((stock, idx) => ({
    date: stock.symbol || `Stock ${idx+1}`,
    price: 1 + (idx / filteredStocks.length) * 0.6,
    trend: 1.05 + (idx / filteredStocks.length) * 0.5
  }));
}

const WholesaleDistributorsChart = ({ filteredStocks }) => {
  const chartData = generateChartData(filteredStocks);
  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', padding: 24, maxWidth: 700 }}>
      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Wholesale Distributors (2-Year Performance)</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 13 }} label={{ value: 'Date', position: 'insideBottom', offset: -25 }} />
          <YAxis domain={[0.8, 1.6]} tick={{ fontSize: 13 }} label={{ value: 'Price', angle: -90, position: 'insideLeft', offset: 10 }} />
          <Tooltip formatter={(value) => value.toFixed(2)} />
          <Legend verticalAlign="top" height={36} />
          <Line type="monotone" dataKey="price" stroke="#1976d2" strokeWidth={3} dot={false} name="Price" />
          <Line type="monotone" dataKey="trend" stroke="#e53935" strokeDasharray="6 4" strokeWidth={2} dot={false} name="Trend" />
        </LineChart>
      </ResponsiveContainer>
      <button style={{ marginTop: 16, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 500, fontSize: 15, cursor: 'pointer', position: 'absolute', left: 32, bottom: 32 }}>
        View Stocks
      </button>
    </div>
  );
};

export default WholesaleDistributorsChart;
