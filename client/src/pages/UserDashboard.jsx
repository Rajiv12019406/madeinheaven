import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

export function UserDashboard() {
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get('/api/bookings/my')
      .then((r) => setBookings(r.data))
      .catch(() => setError('Could not load bookings'));
  }, []);

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Your dashboard</h1>
          <p>Consultation bookings and payment status.</p>
        </div>
      </div>
      <section className="page-section">
        <div className="container">
          <div className="dash-toolbar">
            <Link to="/book" className="btn btn-primary">
              New booking
            </Link>
          </div>
          {error && <p className="form-error">{error}</p>}
          {!bookings && !error && (
            <div className="card">
              <div className="skeleton" style={{ height: 20, width: '40%' }} />
              <div className="skeleton" style={{ height: 14, width: '100%', marginTop: 12 }} />
            </div>
          )}
          {bookings && bookings.length === 0 && (
            <div className="card empty-state">
              <p>No bookings yet.</p>
              <Link to="/book" className="btn btn-primary">
                Book a consultation
              </Link>
            </div>
          )}
          {bookings && bookings.length > 0 && (
            <div className="table-wrap card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Topic</th>
                    <th>Date</th>
                    <th>Slot</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.topic}</td>
                      <td>{b.preferred_date}</td>
                      <td>{b.time_slot}</td>
                      <td>{formatInr(b.amount_paise)}</td>
                      <td>{statusBadge(b.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="table-footnote">Payment history: rows with status “Paid” include a verified Razorpay payment.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
