# IBAM Auto Edit - Deploy Guide

## 🚀 Publikasi ke Render + Vercel

### 1. Backend Setup (Render.com)

#### Step 1: Push ke GitHub
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

#### Step 2: Buat Render account
- Kunjungi https://render.com
- Login dengan GitHub

#### Step 3: Create New Web Service
1. Klik "New" → "Web Service"
2. Pilih repository `ibam-auto-edit`
3. Konfigurasi:
   - **Name**: `ibam-auto-edit-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (atau Paid jika ingin uptime lebih)

#### Step 4: Set Environment Variables di Render
```
PORT=3001
NODE_ENV=production
WEB_BASE_URL=https://ibam-auto-edit-frontend.vercel.app
```

#### Step 5: Deploy
Render akan auto-deploy setelah push. Tunggu 5-10 menit.

Backend URL akan menjadi: `https://ibam-auto-edit-api.onrender.com`

---

### 2. Frontend Setup (Vercel)

#### Step 1: Buat Vercel account
- Kunjungi https://vercel.com
- Login dengan GitHub

#### Step 2: Import Project
1. Klik "Add New" → "Project"
2. Import repository `ibam-auto-edit`
3. Konfigurasi:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### Step 3: Set Environment Variables
Di halaman "Environment Variables":
```
VITE_API_BASE_URL=https://ibam-auto-edit-api.onrender.com/api
```

#### Step 4: Deploy
Klik "Deploy". Vercel akan auto-build dan deploy.

Frontend URL akan menjadi: `https://ibam-auto-edit.vercel.app`

---

### 3. Update Backend URL di Render

Setelah frontend selesai deploy, update environment variable di Render:
```
WEB_BASE_URL=https://ibam-auto-edit.vercel.app
```

Klik "Manual Deploy" di Render untuk redeploy.

---

## 🧪 Test Setelah Deploy

1. Buka https://ibam-auto-edit.vercel.app
2. Login dengan admin:
   - Username: `develop`
   - Password: `iqbal2008`
3. Test fitur:
   - Daftar user baru
   - Login Google
   - Buat project
   - Upgrade member

---

## 📝 Catatan Penting

- **Database**: Saat ini pakai SQLite lokal. Untuk production lebih proper, gunakan PostgreSQL/MySQL di cloud.
- **QRIS**: Belum terintegrasi, masih placeholder.
- **AI Editing**: Fitur AI yang actual masih butuh integrasi API editing service (seperti FFmpeg cloud, MoviePy API, dll).
- **Storage**: Video projects sekarang hanya di database as metadata, bukan actual file upload.

---

## 🔗 Links Akses

- **Frontend**: https://ibam-auto-edit.vercel.app
- **Backend Health**: https://ibam-auto-edit-api.onrender.com/api/health
- **Admin Panel**: https://ibam-auto-edit.vercel.app/admin

---

## 📧 Support

Jika ada error:
1. Cek console browser (F12)
2. Cek Render logs: https://dashboard.render.com
3. Cek Vercel logs: https://vercel.com/dashboard
