import { useEffect, useState } from 'react';
import { api } from '../api/client';
import './Dashboard.css';

function formatInr(paise) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(paise / 100);
}

function statusBadge(status) {
  if (status === 'paid') return <span className="badge badge-paid">Paid</span>;
  if (status === 'pending_payment') return <span className="badge badge-pending">Unpaid</span>;
  if (status === 'failed') return <span className="badge badge-failed">Failed</span>;
  return <span className="badge badge-failed">Cancelled</span>;
}

export function AdminDashboard() {
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get('/api/bookings/all')
      .then((r) => setBookings(r.data))
      .catch(() => setError('Could not load bookings'));
  }, []);

  const paid = bookings?.filter((b) => b.status === 'paid').length ?? 0;
  const unpaid = bookings?.filter((b) => b.status === 'pending_payment').length ?? 0;

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Admin console</h1>
          <p>All consultation bookings across paid and unpaid states.</p>
        </div>
      </div>
      <section className="page-section">
        <div className="container">
          {bookings && (
            <div className="admin-stats">
              <div className="card stat">
                <span className="stat-label">Total</span>
                <span className="stat-value">{bookings.length}</span>
              </div>
              <div className="card stat">
                <span className="stat-label">Paid</span>
                <span className="stat-value">{paid}</span>
              </div>
              <div className="card stat">
                <span className="stat-label">Unpaid</span>
                <span className="stat-value">{unpaid}</span>
              </div>
            </div>
          )}
          {error && <p className="form-error">{error}</p>}
          {!bookings && !error && (
            <div className="card">
              <div className="skeleton" style={{ height: 20, width: '30%' }} />
              <div className="skeleton" style={{ height: 120, width: '100%', marginTop: 12 }} />
            </div>
          )}
          {bookings && bookings.length === 0 && (
            <div className="card empty-state">
              <p>No bookings in the system yet.</p>
            </div>
          )}
          {bookings && bookings.length > 0 && (
            <div className="table-wrap card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Topic</th>
                    <th>Date</th>
                    <th>Phone</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment ID</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>
                        <div className="cell-stack">
                          <span>{b.user_name}</span>
                          <span className="muted">{b.user_email}</span>
                        </div>
                      </td>
                      <td>{b.topic}</td>
                      <td>{b.preferred_date}</td>
                      <td>{b.phone}</td>
                      <td>{formatInr(b.amount_paise)}</td>
                      <td>{statusBadge(b.status)}</td>
                      <td className="mono">{b.razorpay_payment_id || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
