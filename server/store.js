const DEMO_STUDENTS = [
  { userId: 'u1', name: 'Nguyen Minh Anh', studentId: 'FTU20230001', pin: '1111', balance: 200000 },
  { userId: 'u2', name: 'Tran Bao Chau', studentId: 'FTU20230002', pin: '1111', balance: 180000 },
  { userId: 'u3', name: 'Le Hoang Nam', studentId: 'FTU20230003', pin: '1111', balance: 250000 },
  { userId: 'u4', name: 'Pham Thu Trang', studentId: 'FTU20230004', pin: '1111', balance: 220000 },
  { userId: 'u5', name: 'Vo Quoc Dat', studentId: 'FTU20230005', pin: '1111', balance: 160000 },
  { userId: 'u6', name: 'Bui Gia Han', studentId: 'FTU20230006', pin: '1111', balance: 300000 },
  { userId: 'u7', name: 'Do Tuan Kiet', studentId: 'FTU20230007', pin: '1111', balance: 140000 },
  { userId: 'u8', name: 'Dang Yen Nhi', studentId: 'FTU20230008', pin: '1111', balance: 190000 },
  { userId: 'u9', name: 'Phan Duc Long', studentId: 'FTU20230009', pin: '1111', balance: 210000 },
  { userId: 'u10', name: 'Ngo Lan Huong', studentId: 'FTU20230010', pin: '1111', balance: 230000 }
];

const MERCHANT = {
  merchantId: 'm1',
  name: 'FA Campus Services',
  pin: '9999',
  role: 'merchant'
};

const state = {
  students: structuredClone(DEMO_STUDENTS),
  merchant: { ...MERCHANT },
  sessions: new Map(),
  walletTokens: [],
  transactions: []
};

function randomString(length = 24) {
  return Math.random().toString(36).slice(2) + Date.now().toString(36).slice(-6);
}

function createSession(payload) {
  const token = randomString(30);
  state.sessions.set(token, payload);
  return token;
}

function getSession(token) {
  return state.sessions.get(token);
}

function findStudentByStudentId(studentId) {
  return state.students.find((s) => s.studentId === studentId);
}

function findStudentById(userId) {
  return state.students.find((s) => s.userId === userId);
}

function createWalletToken(userId) {
  const token = randomString(18);
  const shortCode = randomString(8).slice(0, 8).toUpperCase();
  const expiresAt = Date.now() + 15000;
  const entry = { token, shortCode, userId, expiresAt, used: false };
  state.walletTokens.push(entry);
  return entry;
}

function findWalletToken(tokenOrCode) {
  return state.walletTokens
    .slice()
    .reverse()
    .find((t) => t.token === tokenOrCode || t.shortCode === tokenOrCode);
}

function addTransaction(tx) {
  state.transactions.push(tx);
  return tx;
}

function getStudentTransactions(userId, limit = 10) {
  return state.transactions
    .filter((tx) => tx.userId === userId)
    .slice()
    .reverse()
    .slice(0, limit);
}

function getMerchantTransactions(limit = 10) {
  return state.transactions.slice().reverse().slice(0, limit);
}

function resetDemoData() {
  state.students = structuredClone(DEMO_STUDENTS);
  state.walletTokens = [];
  state.transactions = [];
}

module.exports = {
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
};
