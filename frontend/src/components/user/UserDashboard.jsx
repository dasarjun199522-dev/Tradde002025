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

  // Extract filter options from CSV data
  // All unique industries for the Industry Sectors dropdown
  const industries = useMemo(() => getUniqueValues(csvStocks, 'industry'), [csvStocks]);
  // Only show symbols for the selected industry
  const symbols = useMemo(() => {
    if (!selectedIndustry) return getUniqueValues(csvStocks, 'symbol');
    return getUniqueValues(csvStocks.filter(stock => stock.industry === selectedIndustry), 'symbol');
  }, [csvStocks, selectedIndustry]);

  // Filter state
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');

  // Filtered data (for future chart/data use)
  const filteredStocks = useMemo(() => {
    return csvStocks.filter(stock => {
      return (
        (!selectedIndustry || stock.industry === selectedIndustry) &&
        (!selectedSymbol || stock.symbol === selectedSymbol)
      );
    });
  }, [csvStocks, selectedIndustry, selectedSymbol]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fafbfc' }}>
      {/* Side Panel */}
      <div style={{ width: 260, background: '#fff', borderRight: '1px solid #eee', padding: 24 }}>
        <h4 style={{ marginBottom: 24 }}>Settings</h4>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Industry</label>
          <select value={selectedIndustry} onChange={e => setSelectedIndustry(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}>
            <option value="">All</option>
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Industry Symbol</label>
          <select value={selectedSymbol} onChange={e => setSelectedSymbol(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}>
            <option value="">All</option>
            {symbols.map(sym => (
              <option key={sym} value={sym}>{sym}</option>
            ))}
          </select>
        </div>
        {/* Add more filters as needed */}
      </div>
      {/* Main Content */}
      <div style={{ flex: 1, padding: 32 }}>
        <WholesaleDistributorsChart filteredStocks={filteredStocks} />
        {/* You can pass filteredStocks to the chart for dynamic updates */}
        {loading && <div>Loading stock data...</div>}
      </div>
    </div>
  );
};

export default UserDashboard;
