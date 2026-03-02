# FA Prototype

Local full-stack prototype for campus wallet demo (student app + merchant POS).

## Stack
- `server`: Node.js + Express, in-memory data
- `client`: React + Vite

## Features
- Student login, dashboard, wallet balance, rotating QR token every 10s (15s expiry)
- Merchant login, POS charge via QR scan or manual token/short code input
- Wallet deduction and transaction history
- Student preorder/rooms/timetable demo pages
- Hidden `/admin` tools for top-up + reset using admin pin

## Demo accounts
- Students: `FTU20230001` ... `FTU20230010`, PIN `1111`
- Merchant: ID `m1`, PIN `9999`
- Admin pin (for `/admin`): `123456` (or set `ADMIN_PIN`)

## Run locally
```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Demo script
1. Student logs in and opens **Wallet** to show rotating QR + short code + balance.
2. Merchant logs in on another tab/device, enters amount/service, scans QR or pastes short code.
3. Charge succeeds, merchant sees receipt message, student refreshes wallet and sees reduced balance + new transaction.
4. Open `/admin` for emergency top-up/reset during presentation.
