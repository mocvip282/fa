const express = require('express');
const cors = require('cors');
const {
  state,
  MERCHANT,
  createSession,
  getSession,
  findStudentByStudentId,
  findStudentById,
  createWalletToken,
  findWalletToken,
  addTransaction,
  getStudentTransactions,
  getMerchantTransactions,
  resetDemoData,
  randomString
} = require('./store');

const app = express();
const PORT = 3001;
const ADMIN_PIN = process.env.ADMIN_PIN || '123456';

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.status(401).json({ message: 'Missing auth token.' });
  }

  const session = getSession(token);
  if (!session) {
    return res.status(401).json({ message: 'Invalid session.' });
  }

  req.session = session;
  next();
}

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', app: 'FA Prototype' });
});

app.post('/api/login', (req, res) => {
  const { studentId, pin, role } = req.body || {};

  if (!studentId || !pin || !role) {
    return res.status(400).json({ message: 'studentId, pin and role are required.' });
  }

  if (role === 'student') {
    const student = findStudentByStudentId(studentId);
    if (!student || student.pin !== pin) {
      return res.status(401).json({ message: 'Invalid student credentials.' });
    }

    const authToken = createSession({ role: 'student', userId: student.userId });
    return res.json({
      authToken,
      role: 'student',
      profile: {
        userId: student.userId,
        name: student.name,
        studentId: student.studentId,
        balance: student.balance
      }
    });
  }

  if (role === 'merchant') {
    if (studentId !== MERCHANT.merchantId || pin !== MERCHANT.pin) {
      return res.status(401).json({ message: 'Invalid merchant credentials.' });
    }

    const authToken = createSession({ role: 'merchant', merchantId: MERCHANT.merchantId });
    return res.json({
      authToken,
      role: 'merchant',
      profile: MERCHANT
    });
  }

  return res.status(400).json({ message: 'Role must be student or merchant.' });
});

app.get('/api/me', authMiddleware, (req, res) => {
  if (req.session.role === 'student') {
    const student = findStudentById(req.session.userId);
    return res.json({
      role: 'student',
      profile: {
        userId: student.userId,
        name: student.name,
        studentId: student.studentId,
        balance: student.balance
      }
    });
  }

  return res.json({ role: 'merchant', profile: MERCHANT });
});

app.get('/api/transactions', authMiddleware, (req, res) => {
  const limit = Number(req.query.limit) || 10;

  if (req.session.role === 'student') {
    return res.json({
      transactions: getStudentTransactions(req.session.userId, limit)
    });
  }

  return res.json({
    transactions: getMerchantTransactions(limit)
  });
});

app.post('/api/wallet/token', authMiddleware, (req, res) => {
  if (req.session.role !== 'student') {
    return res.status(403).json({ message: 'Only students can generate wallet tokens.' });
  }

  const walletToken = createWalletToken(req.session.userId);
  res.json(walletToken);
});

app.post('/api/merchant/charge', authMiddleware, (req, res) => {
  if (req.session.role !== 'merchant') {
    return res.status(403).json({ message: 'Only merchants can charge wallets.' });
  }

  const { tokenOrCode, amount, service } = req.body || {};
  const validServices = ['canteen', 'cafe', 'parking', 'preorder'];

  if (!tokenOrCode || !amount || !service) {
    return res.status(400).json({ message: 'tokenOrCode, amount, service are required.' });
  }

  if (!validServices.includes(service)) {
    return res.status(400).json({ message: 'Invalid service.' });
  }

  const parsedAmount = Number(amount);
  if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ message: 'Amount must be a positive integer.' });
  }

  const token = findWalletToken(String(tokenOrCode).trim());
  if (!token) {
    return res.status(404).json({ message: 'Invalid token or short code.' });
  }

  if (token.used) {
    return res.status(409).json({ message: 'Token already used.' });
  }

  if (Date.now() > token.expiresAt) {
    return res.status(410).json({ message: 'Token expired.' });
  }

  const student = findStudentById(token.userId);
  if (!student) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  if (student.balance < parsedAmount) {
    return res.status(422).json({ message: 'Insufficient balance.' });
  }

  student.balance -= parsedAmount;
  token.used = true;

  const transaction = addTransaction({
    transactionId: randomString(16),
    userId: student.userId,
    studentName: student.name,
    studentId: student.studentId,
    merchantId: MERCHANT.merchantId,
    merchantName: MERCHANT.name,
    service,
    amount: parsedAmount,
    createdAt: Date.now()
  });

  return res.json({
    message: 'Charge successful.',
    updatedBalance: student.balance,
    transaction
  });
});

app.post('/api/student/preorder/pay', authMiddleware, (req, res) => {
  if (req.session.role !== 'student') {
    return res.status(403).json({ message: 'Only students can pay preorder.' });
  }

  const { amount, items } = req.body || {};
  const parsedAmount = Number(amount);
  if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ message: 'Amount must be a positive integer.' });
  }

  const student = findStudentById(req.session.userId);
  if (student.balance < parsedAmount) {
    return res.status(422).json({ message: 'Insufficient balance.' });
  }

  student.balance -= parsedAmount;

  const transaction = addTransaction({
    transactionId: randomString(16),
    userId: student.userId,
    studentName: student.name,
    studentId: student.studentId,
    merchantId: MERCHANT.merchantId,
    merchantName: MERCHANT.name,
    service: 'preorder',
    amount: parsedAmount,
    items: items || [],
    createdAt: Date.now()
  });

  return res.json({ message: 'Preorder paid.', updatedBalance: student.balance, transaction });
});

app.post('/api/admin/topup', (req, res) => {
  const { adminPin, userId, amount } = req.body || {};
  if (adminPin !== ADMIN_PIN) {
    return res.status(401).json({ message: 'Invalid admin pin.' });
  }

  const student = findStudentById(userId);
  if (!student) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  const parsedAmount = Number(amount);
  if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ message: 'Amount must be positive integer.' });
  }

  student.balance += parsedAmount;
  res.json({ message: 'Top-up successful.', student });
});

app.post('/api/admin/reset', (req, res) => {
  const { adminPin } = req.body || {};
  if (adminPin !== ADMIN_PIN) {
    return res.status(401).json({ message: 'Invalid admin pin.' });
  }

  resetDemoData();
  res.json({ message: 'Demo data reset.' });
});

app.get('/api/admin/students', (req, res) => {
  const { pin } = req.query;
  if (pin !== ADMIN_PIN) {
    return res.status(401).json({ message: 'Invalid admin pin.' });
  }

  res.json({
    students: state.students.map(({ userId, name, studentId, balance }) => ({ userId, name, studentId, balance }))
  });
});

app.listen(PORT, () => {
  console.log(`FA server running on http://localhost:${PORT}`);
});
