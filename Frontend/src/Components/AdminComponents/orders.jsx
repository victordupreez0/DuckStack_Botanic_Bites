import React from 'react';

// Dummy frontend-only orders data
const DUMMY_ORDERS = [
  {
    id: 'ORD-1001',
    customer: 'Alice Smith',
    email: 'alice@example.com',
    total: 349.99,
    status: 'pending', // pending | paid | shipped | cancelled | refunded
    items: 3,
    createdAt: '2025-09-01 10:22',
    paidAt: null,
  },
  {
    id: 'ORD-1002',
    customer: 'Bob Johnson',
    email: 'bob@example.com',
    total: 129.5,
    status: 'paid',
    items: 1,
    createdAt: '2025-09-02 09:05',
    paidAt: '2025-09-02 09:06',
  },
  {
    id: 'ORD-1003',
    customer: 'Carol Lee',
    email: 'carol@example.com',
    total: 499.0,
    status: 'shipped',
    items: 5,
    createdAt: '2025-09-03 14:11',
    paidAt: '2025-09-03 14:12',
  },
  {
    id: 'ORD-1004',
    customer: 'Dan Davis',
    email: 'dan@example.com',
    total: 89.99,
    status: 'cancelled',
    items: 2,
    createdAt: '2025-09-03 18:44',
    paidAt: null,
  },
  {
    id: 'ORD-1005',
    customer: 'Ella Stone',
    email: 'ella@example.com',
    total: 215.75,
    status: 'refunded',
    items: 4,
    createdAt: '2025-09-04 08:30',
    paidAt: '2025-09-04 08:32',
  },
  {
    id: 'ORD-1006',
    customer: 'Frank Brown',
    email: 'frank@example.com',
    total: 54.0,
    status: 'pending',
    items: 1,
    createdAt: '2025-09-05 11:02',
    paidAt: null,
  },
];

const statusBadge = (status) => {
  const base = 'badge';
  switch (status) {
    case 'pending': return base + ' badge-warning';
    case 'paid': return base + ' badge-success';
    case 'shipped': return base + ' badge-info';
    case 'cancelled': return base + ' badge-error';
    case 'refunded': return base + ' badge-neutral';
    default: return base;
  }
};

const Orders = () => {
  const [filter, setFilter] = React.useState('all'); // all | pending | paid | shipped | cancelled | refunded
  const [search, setSearch] = React.useState('');

  const counts = React.useMemo(() => {
    const all = DUMMY_ORDERS.length;
    const grouped = DUMMY_ORDERS.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});
    return {
      all,
      pending: grouped.pending || 0,
      paid: grouped.paid || 0,
      shipped: grouped.shipped || 0,
      cancelled: grouped.cancelled || 0,
      refunded: grouped.refunded || 0,
    };
  }, []);

  const filtered = React.useMemo(() => {
    return DUMMY_ORDERS.filter(o => {
      if (filter !== 'all' && o.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filter, search]);

  return (
    <div className="overflow-x-auto rounded-box bg-white p-4">
      <h2 className="text-2xl font-bold mb-4 text-left text-black">Orders</h2>

      <div className="flex flex-wrap gap-3 items-center mb-4 w-full">
        <div className="btn-group">
          <button className={`btn m-2 ${filter === 'all' ? 'btn-primary' : ''}`} onClick={() => setFilter('all')}>All ({counts.all})</button>
          <button className={`btn m-2 ${filter === 'pending' ? 'btn-primary' : ''}`} onClick={() => setFilter('pending')}>Pending ({counts.pending})</button>
          <button className={`btn m-2 ${filter === 'paid' ? 'btn-primary' : ''}`} onClick={() => setFilter('paid')}>Paid ({counts.paid})</button>
          <button className={`btn m-2 ${filter === 'shipped' ? 'btn-primary' : ''}`} onClick={() => setFilter('shipped')}>Shipped ({counts.shipped})</button>
          <button className={`btn m-2 ${filter === 'cancelled' ? 'btn-primary' : ''}`} onClick={() => setFilter('cancelled')}>Cancelled ({counts.cancelled})</button>
          <button className={`btn m-2 ${filter === 'refunded' ? 'btn-primary' : ''}`} onClick={() => setFilter('refunded')}>Refunded ({counts.refunded})</button>
        </div>
        <input
          type="text"
          placeholder="Search (id / name / email)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input input-bordered w-full max-w-xs bg-white text-black"
        />
      </div>

      <table className="table bg-white text-black">
        <thead className="text-black">
          <tr>
            <th>#</th>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Email</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length ? filtered.map((o, idx) => (
            <tr key={o.id} className="hover:bg-gray-100">
              <th>{idx + 1}</th>
              <td className="font-mono text-sm">{o.id}</td>
              <td>{o.customer}</td>
              <td>{o.email}</td>
              <td>{o.items}</td>
              <td>R {o.total.toFixed(2)}</td>
              <td><span className={statusBadge(o.status)}>{o.status}</span></td>
              <td>{o.createdAt}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan={8} className="text-center text-gray-500 bg-white">No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
