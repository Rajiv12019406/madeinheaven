import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import db from './db.js';
import { FRONTEND_PUBLIC_URL, sendPasswordResetEmail } from './mail.js';

const PORT = Number(process.env.PORT) || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-change-me';
const CONSULTATION_FEE_PAISE = Number(process.env.CONSULTATION_FEE_PAISE) || 49900;

const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return;
  const hash = bcrypt.hashSync(password, 10);
  db.prepare(
    `INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'admin')`
  ).run(email, hash, 'Administrator');
  console.log(`Seeded admin user: ${email}`);
}

seedAdmin();

const app = express();
const corsOptions = {
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

function signToken(user, expiresIn = '7d') {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn }
  );
}

function hashResetToken(token) {
  return crypto.createHash('sha256').update(String(token), 'utf8').digest('hex');
}

function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  try {
    const payload = jwt.verify(h.slice(7), JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

app.get('/api/health', (_, res) => {
  res.json({ ok: true });
});

app.get('/api/config/public', (_, res) => {
  res.json({
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
    consultationFeePaise: CONSULTATION_FEE_PAISE,
    paymentsEnabled: Boolean(razorpay && process.env.RAZORPAY_KEY_ID),
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email, password, and name are required' });
  }
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(String(email).toLowerCase());
  if (exists) {
    return res.status(409).json({ message: 'Email already registered' });
  }
  const hash = bcrypt.hashSync(String(password), 10);
  const info = db
    .prepare(
      `INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'user')`
    )
    .run(String(email).toLowerCase(), hash, String(name).trim());
  const user = {
    id: info.lastInsertRowid,
    email: String(email).toLowerCase(),
    name: String(name).trim(),
    role: 'user',
  };
  const token = signToken(user);
  res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password, rememberMe } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(String(email).toLowerCase());
  if (!row || !bcrypt.compareSync(String(password), row.password_hash)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  const user = {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
  };
  const expiresIn = rememberMe === true || rememberMe === 'true' ? '30d' : '7d';
  res.json({ token: signToken(user, expiresIn), user });
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const row = db.prepare('SELECT id, email FROM users WHERE email = ?').get(String(email).toLowerCase());
    const generic = {
      message:
        'If that email is registered, we sent a password reset link. Check your inbox and spam folder. The link expires in one hour.',
    };

    if (row) {
      const plainToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = hashResetToken(plainToken);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      db.prepare('DELETE FROM password_resets WHERE user_id = ?').run(row.id);
      db.prepare(
        `INSERT INTO password_resets (user_id, token_hash, expires_at, used) VALUES (?, ?, ?, 0)`
      ).run(row.id, tokenHash, expiresAt);

      const resetUrl = `${FRONTEND_PUBLIC_URL}/reset-password?token=${encodeURIComponent(plainToken)}`;

      if (process.env.RESET_TOKEN_IN_RESPONSE === 'true') {
        return res.json({
          ...generic,
          resetUrl,
          resetToken: plainToken,
          note: 'RESET_TOKEN_IN_RESPONSE is enabled — disable in production.',
        });
      }

      try {
        const { sent } = await sendPasswordResetEmail({ to: row.email, resetUrl });
        if (!sent) {
          console.warn('[password-reset] Email not sent; reset URL was logged above for ops.');
        }
      } catch (e) {
        console.error('[password-reset] Email error:', e.message);
      }
    }

    return res.json(generic);
  } catch (e) {
    console.error('[password-reset]', e);
    return res.status(500).json({ message: 'Could not process password reset request.' });
  }
});

app.post('/api/auth/reset-password', (req, res) => {
  const { token, password } = req.body || {};
  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }
  if (String(password).length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }
  const tokenHash = hashResetToken(token);
  const row = db.prepare(`SELECT * FROM password_resets WHERE token_hash = ? AND used = 0`).get(tokenHash);
  if (!row || Number.isNaN(new Date(row.expires_at).getTime()) || new Date(row.expires_at).getTime() < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired reset link. Request a new one.' });
  }
  const hash = bcrypt.hashSync(String(password), 10);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, row.user_id);
  db.prepare('UPDATE password_resets SET used = 1 WHERE id = ?').run(row.id);
  res.json({ message: 'Password updated. You can sign in now.' });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const row = db.prepare('SELECT id, email, name, role, created_at FROM users WHERE id = ?').get(req.user.sub);
  if (!row) return res.status(404).json({ message: 'User not found' });
  res.json(row);
});

app.post('/api/bookings', authMiddleware, (req, res) => {
  const { topic, preferredDate, timeSlot, phone, notes } = req.body || {};
  if (!topic || !preferredDate || !timeSlot || !phone) {
    return res.status(400).json({ message: 'Topic, preferred date, time slot, and phone are required' });
  }
  const info = db
    .prepare(
      `INSERT INTO bookings (user_id, topic, preferred_date, time_slot, phone, notes, amount_paise, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending_payment')`
    )
    .run(
      req.user.sub,
      String(topic).trim(),
      String(preferredDate).trim(),
      String(timeSlot).trim(),
      String(phone).trim(),
      notes != null ? String(notes) : '',
      CONSULTATION_FEE_PAISE
    );
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(booking);
});

app.post('/api/payments/create-order', authMiddleware, async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({ message: 'Payments are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' });
  }
  const { bookingId } = req.body || {};
  const id = Number(bookingId);
  if (!id) return res.status(400).json({ message: 'bookingId is required' });

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
  if (!booking || booking.user_id !== req.user.sub) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  if (booking.status !== 'pending_payment') {
    return res.status(400).json({ message: 'Booking is not awaiting payment' });
  }

  try {
    const order = await razorpay.orders.create({
      amount: booking.amount_paise,
      currency: 'INR',
      receipt: `bk_${booking.id}_${Date.now()}`,
      notes: { bookingId: String(booking.id), userId: String(req.user.sub) },
    });

    db.prepare('UPDATE bookings SET razorpay_order_id = ?, updated_at = datetime(\'now\') WHERE id = ?').run(
      order.id,
      booking.id
    );

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      bookingId: booking.id,
    });
  } catch (e) {
    console.error(e);
    res.status(502).json({ message: 'Could not create payment order', detail: e.message });
  }
});

app.post('/api/payments/verify', authMiddleware, (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId,
  } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
    return res.status(400).json({ message: 'Missing payment verification fields' });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return res.status(503).json({ message: 'Payment verification not configured' });
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');

  if (expected !== razorpay_signature) {
    return res.status(400).json({ message: 'Invalid payment signature' });
  }

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(Number(bookingId));
  if (!booking || booking.user_id !== req.user.sub) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  if (booking.razorpay_order_id && booking.razorpay_order_id !== razorpay_order_id) {
    return res.status(400).json({ message: 'Order mismatch' });
  }

  db.prepare(
    `UPDATE bookings SET status = 'paid', razorpay_payment_id = ?, razorpay_order_id = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(razorpay_payment_id, razorpay_order_id, booking.id);

  const updated = db.prepare('SELECT * FROM bookings WHERE id = ?').get(booking.id);
  res.json({ success: true, booking: updated });
});

app.get('/api/bookings/my', authMiddleware, (req, res) => {
  const rows = db
    .prepare(
      `SELECT id, topic, preferred_date, time_slot, phone, notes, amount_paise, status,
              razorpay_order_id, razorpay_payment_id, created_at, updated_at
       FROM bookings WHERE user_id = ? ORDER BY created_at DESC`
    )
    .all(req.user.sub);
  res.json(rows);
});

app.get('/api/bookings/all', authMiddleware, adminOnly, (req, res) => {
  const rows = db
    .prepare(
      `SELECT b.*, u.email as user_email, u.name as user_name
       FROM bookings b
       JOIN users u ON u.id = b.user_id
       ORDER BY b.created_at DESC`
    )
    .all();
  res.json(rows);
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
