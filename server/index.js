import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = Number(process.env.PORT) || 3001;
const nodeEnv = process.env.NODE_ENV || 'development';

app.use(cors({
  origin: process.env.WEB_BASE_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, name: 'IBAM Auto Edit API', env: nodeEnv });
});

const distPath = path.join(__dirname, '..', 'dist');

if (nodeEnv === 'production') {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`✨ IBAM Auto Edit server berjalan di http://localhost:${port}`);
  console.log(`📦 Environment: ${nodeEnv}`);
  console.log(`🔐 CORS origin: ${process.env.WEB_BASE_URL || 'http://localhost:5173'}`);
});
