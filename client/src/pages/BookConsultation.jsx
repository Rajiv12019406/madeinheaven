import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { loadRazorpayScript } from '../lib/razorpay';
import './BookConsultation.css';

function formatInr(paise) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(paise / 100);
}

export function BookConsultation() {
  const { user, token } = useAuth();
  const [feePaise, setFeePaise] = useState(null);
  const [paymentsEnabled, setPaymentsEnabled] = useState(false);

  const [topic, setTopic] = useState('corporate');
  const [preferredDate, setPreferredDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api
      .get('/api/config/public')
      .then((r) => {
        setFeePaise(r.data.consultationFeePaise);
        setPaymentsEnabled(r.data.paymentsEnabled);
      })
      .catch(() => setFeePaise(49900));
  }, []);

  async function payAndBook(e) {
    e.preventDefault();
    setMessage(null);
    if (!user || !token) return;

    if (!paymentsEnabled) {
      setMessage({
        type: 'err',
        text: 'Payments are not configured on the server. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file.',
      });
      return;
    }

    setLoading(true);
    try {
      const { data: booking } = await api.post('/api/bookings', {
        topic,
        preferredDate,
        timeSlot,
        phone,
        notes,
      });

      const { data: order } = await api.post('/api/payments/create-order', { bookingId: booking.id });

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        setMessage({ type: 'err', text: 'Could not load Razorpay checkout. Check your network.' });
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Made in Heaven Legal',
        description: `Consultation #${order.bookingId}`,
        order_id: order.orderId,
        handler: async (response) => {
          try {
            await api.post('/api/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: order.bookingId,
            });
            setMessage({
              type: 'ok',
              text: 'Payment successful. Your consultation is booked and recorded. You can review it in your dashboard.',
            });
          } catch (verifyErr) {
            if (isAxiosError(verifyErr) && verifyErr.response?.data) {
              const m = verifyErr.response.data.message;
              setMessage({ type: 'err', text: m || 'Verification failed' });
            } else {
              setMessage({
                type: 'err',
                text: 'Payment captured but verification failed. Contact support with your payment ID.',
              });
            }
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: phone,
        },
        theme: { color: '#c9a227' },
       
      });

      rzp.on('payment.failed', (fail) => {
        setLoading(false);
        setMessage({
          type: 'err',
          text: fail?.error?.description || 'Payment failed or was cancelled.',
        });
      });

      rzp.open();
    } catch (err) {
      if (isAxiosError(err) && err.response?.data) {
        const m = err.response.data.message;
        setMessage({ type: 'err', text: m || 'Request failed' });
      } else {
        setMessage({ type: 'err', text: 'Something went wrong. Please try again.' });
      }
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <>
        <div className="page-hero">
          <div className="container">
            <h1>Book a consultation</h1>
            <p>Sign in to schedule a session and complete secure payment.</p>
          </div>
        </div>
        <section className="page-section">
          <div className="container">
            <div className="card book-gate">
              <p>Please sign in to continue.</p>
              <Link to="/login" className="btn btn-primary" state={{ from: { pathname: '/book' } }}>
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Book a consultation</h1>
          <p>
            Complete the form and pay securely. Fee:{' '}
            <strong>{feePaise != null ? formatInr(feePaise) : '…'}</strong>
          </p>
        </div>
      </div>
      <section className="page-section">
        <div className="container book-layout">
          <form className="card book-form" onSubmit={payAndBook}>
            {message && (
              <div className={message.type === 'ok' ? 'alert alert-ok' : 'alert alert-err'} role="alert">
                {message.text}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="topic">Practice area</label>
              <select id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} disabled={loading}>
                <option value="corporate">Corporate & contracts</option>
                <option value="dispute">Dispute & litigation readiness</option>
                <option value="employment">Employment</option>
                <option value="private">Private client / estate</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pdate">Preferred date</label>
                <input
                  id="pdate"
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="slot">Time (IST)</label>
                <select id="slot" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} disabled={loading}>
                  {['10:00', '11:30', '14:00', '15:30', '17:00'].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                autoComplete="tel"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="notes">Notes (optional)</label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={loading}
                placeholder="Brief context — avoid sharing highly sensitive data in this demo."
              />
            </div>
            <button type="submit" className="btn btn-primary book-cta" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" aria-hidden />
                  Processing…
                </>
              ) : (
                'Pay & book'
              )}
            </button>
            {!paymentsEnabled && (
              <p className="hint">Payments disabled until Razorpay keys are set on the API.</p>
            )}
          </form>
          <aside className="card book-aside">
            <h2>What happens next</h2>
            <ol className="steps">
              <li>We create a Razorpay order for your consultation fee.</li>
              <li>You complete payment in the secure Razorpay window.</li>
              <li>We verify the signature server-side and mark your booking as paid.</li>
            </ol>
          </aside>
        </div>
      </section>
    </>
  );
}
