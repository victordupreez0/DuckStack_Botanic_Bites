import React, { useEffect, useState } from 'react';

const History = () => {
  const [rows, setRows] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('stockHistory') || '[]');
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const handler = (ev) => {
      const entry = ev?.detail;
      if (!entry) return;
      setRows(prev => [entry, ...prev]);
    };
    window.addEventListener('admin:historyUpdated', handler);
    return () => window.removeEventListener('admin:historyUpdated', handler);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-black">History</h2>
      <div className="overflow-x-auto rounded-box border border-gray-200 bg-white">
        <table className="table w-full bg-white text-black">
          <thead className="text-black">
            <tr>
              <th className="text-black">#</th>
              <th className="text-black">Product</th>
              <th className="text-black">User</th>
              <th className="text-black">Amount</th>
              <th className="text-black">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-black">No history yet.</td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={idx} className="hover:bg-gray-100 text-black">
                  <th className="text-black">{idx + 1}</th>
                  <td className="text-black">{r.productName}</td>
                  <td className="text-black">{r.user}</td>
                  <td className="text-black">{r.amount}</td>
                  <td className="text-black">{new Date(r.date).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
