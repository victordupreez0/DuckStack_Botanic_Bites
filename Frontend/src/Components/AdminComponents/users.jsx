import React from 'react';

const Users = () => {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [filter, setFilter] = React.useState('all'); // all | admins | resellers

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/admin/users', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || res.statusText || 'Failed to fetch users');
      }
      const data = await res.json();
      setUsers(data || []);
    } catch (err) {
      setError(err.message || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { fetchUsers(); }, []);

  const filtered = React.useMemo(() => {
    if (filter === 'admins') return users.filter(u => u.isAdmin);
    if (filter === 'resellers') return users.filter(u => u.reseller);
    return users;
  }, [users, filter]);

  const counts = React.useMemo(() => ({
    all: users.length,
    admins: users.filter(u => u.isAdmin).length,
    resellers: users.filter(u => u.reseller).length,
  }), [users]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users</h2>

      <div className="flex gap-3 items-center mb-4">
        <div className="btn-group">
          <button className={`btn ${filter === 'all' ? 'btn-primary' : ''}`} onClick={() => setFilter('all')}>All ({counts.all})</button>
          <button className={`btn ${filter === 'admins' ? 'btn-primary' : ''}`} onClick={() => setFilter('admins')}>Admins ({counts.admins})</button>
          <button className={`btn ${filter === 'resellers' ? 'btn-primary' : ''}`} onClick={() => setFilter('resellers')}>Resellers ({counts.resellers})</button>
        </div>
        <button className="btn btn-outline ml-auto" onClick={fetchUsers}>Refresh</button>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Reseller</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center text-error">{error}</td>
              </tr>
            ) : filtered && filtered.length > 0 ? (
              filtered.map((u, idx) => (
                <tr key={u._id || u.email} className="hover">
                  <th>{idx + 1}</th>
                  <td>{(u.name || '') + (u.surname ? ' ' + u.surname : '') || '-'}</td>
                  <td>{u.username || '-'}</td>
                  <td>{u.email || '-'}</td>
                  <td>{u.isAdmin ? <span className="badge badge-success">Yes</span> : <span className="badge">No</span>}</td>
                  <td>{u.reseller ? <span className="badge badge-info">Yes</span> : <span className="badge">No</span>}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
