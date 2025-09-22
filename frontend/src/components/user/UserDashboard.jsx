import React, { useState, useMemo, useEffect } from 'react';
import WholesaleDistributorsChart from './WholesaleDistributorsChart';

// Helper to extract unique values from CSV data
function getUniqueValues(data, key) {
  return Array.from(new Set(data.map(item => item[key] || ''))).filter(Boolean);
}


const UserDashboard = () => {
  const [csvStocks, setCsvStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch CSV stocks from backend
  useEffect(() => {
    async function fetchStocks() {
      setLoading(true);
      try {
        const res = await fetch('/admin/api/stocks');
        const data = await res.json();
        if (data.success && Array.isArray(data.stocks)) {
          setCsvStocks(data.stocks);
        }
      } catch (e) {
        setCsvStocks([]);
      }
      setLoading(false);
    }
    fetchStocks();
  }, []);

  // All unique symbols from the CSV for the Symbol dropdown
  const symbols = useMemo(() => getUniqueValues(csvStocks, 'symbol'), [csvStocks]);

  // Filter state
  const [selectedSymbol, setSelectedSymbol] = useState('');

  // Filtered data (for future chart/data use)
  const filteredStocks = useMemo(() => {
    return csvStocks.filter(stock => {
      return (!selectedSymbol || stock.symbol === selectedSymbol);
    });
  }, [csvStocks, selectedSymbol]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fafbfc' }}>
      {/* Side Panel */}
      <div style={{ width: 260, background: '#fff', borderRight: '1px solid #eee', padding: 24 }}>
        <h4 style={{ marginBottom: 24 }}>Settings</h4>
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="symbol-select" style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Symbol (from CSV)</label>
          <select
            id="symbol-select"
            name="symbol"
            value={selectedSymbol}
            onChange={e => setSelectedSymbol(e.target.value)}
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          >
            <option value="">All</option>
            {symbols.map(sym => (
              <option key={sym} value={sym}>{sym}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: 32 }}>
        <WholesaleDistributorsChart filteredStocks={filteredStocks} />
        {/* You can pass filteredStocks to the chart for dynamic updates */}
        {loading && <div>Loading stock data...</div>}

        {/* Removed industry sector section. Only symbol filter remains. */}
      </div>
    </div>
  );
};

export default UserDashboard;
