import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'ibam.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    provider TEXT DEFAULT 'local',
    role TEXT DEFAULT 'free',
    tokens INTEGER DEFAULT 60,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    youtube_url TEXT NOT NULL,
    prompt TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    tokens_used INTEGER DEFAULT 20,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

export function getDb() {
  return db;
}

export function ensureAdmin() {
  const existing = db.prepare('SELECT * FROM users WHERE username = ?').get('develop');
  if (!existing) {
    db.prepare(
      `INSERT INTO users (name, username, email, password, provider, role, tokens)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(
      'Developer Admin',
      'develop',
      'admin@ibam.ai',
      bcrypt.hashSync('iqbal2008', 10),
      'local',
      'developer',
      Number.POSITIVE_INFINITY
    );
  }
}

export function getUserById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

export function getUserByUsernameOrEmail(identifier) {
  return db.prepare(
    'SELECT * FROM users WHERE username = ? OR email = ?'
  ).get(identifier, identifier);
}

export function createUser({ name, username, email, password, provider = 'local', role = 'free', tokens = 60 }) {
  const hashedPassword = password ? bcrypt.hashSync(password, 10) : null;
  const result = db.prepare(
    `INSERT INTO users (name, username, email, password, provider, role, tokens)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(name, username, email, hashedPassword, provider, role, tokens);

  return getUserById(result.lastInsertRowid);
}

export function updateUserTokens(userId, tokens) {
  db.prepare('UPDATE users SET tokens = ? WHERE id = ?').run(tokens, userId);
  return getUserById(userId);
}

export function getUsers() {
  return db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
}

export function createProject({ userId, title, youtubeUrl, prompt, tokensUsed = 20 }) {
  const result = db.prepare(
    `INSERT INTO projects (user_id, title, youtube_url, prompt, tokens_used)
     VALUES (?, ?, ?, ?, ?)`
  ).run(userId, title, youtubeUrl, prompt, tokensUsed);

  return db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
}

export function getProjectsByUser(userId) {
  return db.prepare('SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC').all(userId);
}

export function getProjectById(id) {
  return db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
}

ensureAdmin();
