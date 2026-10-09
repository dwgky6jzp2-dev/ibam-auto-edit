# IBAM Auto Edit

IBAM Auto Edit adalah platform web publik untuk layanan AI auto edit video YouTube. Website ini dibuat sebagai landing page + dashboard + sistem login admin/member/free dengan konsep token-based usage.

## Fitur utama
- Landing page publik dengan branding "IBAM Auto Edit"
- Login dan register user
- Login Google demo
- Dashboard user
- Project editor AI mockup
- Admin panel demo
- Free, Member, dan Developer tier
- Token system: Free 60 token, setiap project 20 token, Member 10.000 token / bulan, Developer unlimited
- Database lokal SQLite untuk pengembangan awal

## Admin demo
- Username: develop
- Password: iqbal2008

## Teknologi
- React + Vite
- Express.js
- SQLite (better-sqlite3)

## Run locally
```bash
npm install
npm run dev
```

Frontend akan berjalan di http://localhost:5173
API server berjalan di http://localhost:3001

## Publish / deployment
Karena ini web app fullstack, cara paling aman untuk publikasi adalah:

1. Deploy backend ke Render / Railway / Fly.io
2. Deploy frontend ke Vercel / Netlify
3. Set `VITE_API_BASE_URL` di frontend ke URL backend publik
4. Set environment variable `WEB_BASE_URL` pada backend ke URL frontend jika diperlukan

### Backend (Render/Railway)
- Build command: `npm install`
- Start command: `npm start`
- Environment variable utama:
  - `PORT=3001`
  - `NODE_ENV=production`
  - `WEB_BASE_URL=https://your-frontend-url.vercel.app`

### Frontend (Vercel)
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable:
  - `VITE_API_BASE_URL=https://your-backend-url.onrender.com/api`

### Contoh base URL frontend
```bash
VITE_API_BASE_URL=https://ibam-auto-edit-api.onrender.com/api
```

## Notes
- QRIS masih placeholder dan akan diaktifkan saat tahap siap publikasi.
- Fitur AI editing video yang benar-benar mengolah YouTube dan menghasilkan video final masih memerlukan integrasi API AI / workflow editing nyata.
