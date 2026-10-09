#!/bin/bash

# IBAM Auto Edit - Quick Deploy Script

echo "🚀 IBAM Auto Edit - Publication Setup"
echo ""

echo "📋 Checklist sebelum publikasi:"
echo "1. Push semua changes ke GitHub ✓"
echo "2. Buat Render account (render.com)"
echo "3. Buat Vercel account (vercel.com)"
echo ""

echo "🔗 Langkah deploy:"
echo "A. Backend (Render):"
echo "   - New Web Service → Pilih repo"
echo "   - Build: npm install"
echo "   - Start: npm start"
echo "   - Env vars: PORT=3001, NODE_ENV=production"
echo ""
echo "B. Frontend (Vercel):"
echo "   - Import project → Framework: Vite"
echo "   - Build: npm run build"
echo "   - Env: VITE_API_BASE_URL=https://ibam-auto-edit-api.onrender.com/api"
echo ""
echo "C. Update Render WEB_BASE_URL ke Vercel frontend URL"
echo ""
echo "✅ Selesai! Buka https://ibam-auto-edit.vercel.app"
echo ""
echo "Admin login:"
echo "  Username: develop"
echo "  Password: iqbal2008"
