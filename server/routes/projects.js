import express from 'express';
import bcrypt from 'bcryptjs';
import {
  createUser,
  getUserById,
  getUserByUsernameOrEmail,
  getUsers,
  updateUserTokens,
} from '../db.js';

const router = express.Router();

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.substring(7) : '';

  if (!token || !token.startsWith('token-')) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const userId = Number(token.replace('token-', ''));
  const user = getUserById(userId);

  if (!user) {
    return res.status(401).json({ message: 'Invalid token.' });
  }

  req.user = user;
  next();
}

router.post('/login', (req, res) => {
  const { username, email, password } = req.body;
  const identifier = username || email;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Username/email and password are required.' });
  }

  const user = getUserByUsernameOrEmail(identifier);
  if (!user || !user.password || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const safeUser = sanitizeUser(user);
  return res.json({
    user: safeUser,
    token: `token-${user.id}`,
  });
});

router.post('/register', (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const existing = getUserByUsernameOrEmail(username) || getUserByUsernameOrEmail(email);
  if (existing) {
    return res.status(409).json({ message: 'Username or email already registered.' });
  }

  const user = createUser({
    name,
    username,
    email,
    password,
    role: 'free',
    tokens: 60,
  });

  const safeUser = sanitizeUser(user);
  return res.json({
    user: safeUser,
    token: `token-${user.id}`,
  });
});

router.post('/google', (req, res) => {
  const { name, email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Google email is required.' });
  }

  const existing = getUserByUsernameOrEmail(email);
  if (existing) {
    const safeUser = sanitizeUser(existing);
    return res.json({ user: safeUser, token: `token-${existing.id}` });
  }

  const username = `google-${Date.now()}`;
  const user = createUser({
    name: name || 'Google User',
    username,
    email,
    password: null,
    provider: 'google',
    role: 'free',
    tokens: 60,
  });

  const safeUser = sanitizeUser(user);
  return res.json({ user: safeUser, token: `token-${user.id}` });
});

router.get('/me', authRequired, (req, res) => {
  return res.json({ user: sanitizeUser(req.user) });
});

router.get('/users', authRequired, (req, res) => {
  if (req.user.role !== 'developer') {
    return res.status(403).json({ message: 'Only developer can access this area.' });
  }

  return res.json({ users: getUsers().map((user) => sanitizeUser(user)) });
});

router.post('/upgrade-member', authRequired, (req, res) => {
  const updatedUser = updateUserTokens(req.user.id, 10000);
  const safeUser = sanitizeUser({ ...updatedUser, role: 'member' });

  const refreshedUser = getUserById(req.user.id);
  refreshedUser.role = 'member';
  const finalUser = sanitizeUser(refreshedUser);
  return res.json({ user: finalUser });
});

export default router;
