import { useEffect, useState } from 'react';
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });
const TOKEN_KEY = 'ibam-token';
const USER_KEY = 'ibam-user';

function appApiHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminRoute({ user, children }) {
  if (!user || user.role !== 'developer') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem(USER_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const syncUser = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token && !user) {
        try {
          const response = await api.get('/auth/me', { headers: appApiHeaders() });
          setUser(response.data.user);
          localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        } catch {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      }
      setIsBooting(false);
    };

    syncUser();
  }, [user]);

  const saveUser = (nextUser) => {
    const safeUser = nextUser || null;
    setUser(safeUser);
    if (safeUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  };

  const loadProjects = async () => {
    if (!user) return;
    setLoadingProjects(true);
    try {
      const response = await api.get('/projects', { headers: appApiHeaders() });
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Gagal memuat project', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadProjects();
    } else {
      setProjects([]);
    }
  }, [user]);

  const login = async (payload) => {
    const response = await api.post('/auth/login', payload);
    const nextUser = response.data.user;
    localStorage.setItem(TOKEN_KEY, response.data.token);
    saveUser(nextUser);
    return response.data;
  };

  const register = async (payload) => {
    const response = await api.post('/auth/register', payload);
    const nextUser = response.data.user;
    localStorage.setItem(TOKEN_KEY, response.data.token);
    saveUser(nextUser);
    return response.data;
  };

  const googleLogin = async () => {
    const response = await api.post('/auth/google', {
      name: 'Google User',
      email: `google-user-${Date.now()}@ibam.ai`,
    });
    localStorage.setItem(TOKEN_KEY, response.data.token);
    saveUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setProjects([]);
  };

  const createProject = async (payload) => {
    const response = await api.post('/projects', payload, { headers: appApiHeaders() });
    setProjects((current) => [response.data.project, ...current]);
    return response.data.project;
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const response = await api.get('/auth/me', { headers: appApiHeaders() });
      saveUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error(error);
    }
  };

  const upgradeMember = async () => {
    const response = await api.post('/auth/upgrade-member', {}, { headers: appApiHeaders() });
    saveUser(response.data.user);
    return response.data.user;
  };

  const appProps = {
    user,
    setUser: saveUser,
    projects,
    setProjects,
    login,
    register,
    googleLogin,
    logout,
    createProject,
    refreshUser,
    upgradeMember,
    loadingProjects,
    loadProjects,
  };

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header user={user} logout={logout} />
        {!isBooting && (
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/login" element={<AuthPage mode="login" {...appProps} />} />
            <Route path="/register" element={<AuthPage mode="register" {...appProps} />} />
            <Route path="/pricing" element={<PricingPage user={user} upgradeMember={upgradeMember} />} />
            <Route path="/dashboard" element={<ProtectedRoute user={user}><DashboardPage user={user} projects={projects} /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute user={user}><ProjectsPage user={user} createProject={createProject} projects={projects} loadingProjects={loadingProjects} loadProjects={loadProjects} /></ProtectedRoute>} />
            <Route path="/project/:projectId" element={<ProtectedRoute user={user}><ProjectDetailPage /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute user={user}><AdminPage /></AdminRoute>} />
            <Route path="/account" element={<ProtectedRoute user={user}><AccountPage user={user} upgradeMember={upgradeMember} /></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        )}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function Header({ user, logout }) {
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/dashboard', label: 'Dashboard', protected: true },
    { to: '/projects', label: 'Projects', protected: true },
    { to: '/admin', label: 'Admin', protected: true, adminOnly: true },
  ];

  return (
    <header className="topbar">
      <div className="container nav-wrap">
        <Link to="/" className="brand">
          <span className="brand-mark">I</span>
          <span>IBAM Auto Edit</span>
        </Link>

        <nav className="nav">
          {navItems
            .filter((item) => !item.protected || (item.protected && user))
            .filter((item) => !item.adminOnly || (item.adminOnly && user && user.role === 'developer'))
            .map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/account" className="btn btn-ghost">{user.name || user.username}</Link>
              <button onClick={logout} className="btn btn-primary btn-small">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Create account</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function HomePage({ user }) {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">AI Youtube Editor</span>
            <h1>
              aku AI auto edit yang dirancang langsung oleh seorang remaja <span>SMA N 1 Pekanbaru</span> bernama <span>M.IQBAL APRILIAN NASRI</span>
            </h1>
            <p>
              Upload link YouTube, masukkan ide editing, lalu AI kami akan membuat versi edit yang lebih cepat, lebih menarik, dan lebih siap untuk publikasi.
            </p>

            <div className="cta-row">
              <Link to={user ? '/projects' : '/register'} className="btn btn-primary">
                {user ? 'Mulai project' : 'Daftar gratis'}
              </Link>
              <Link to="/pricing" className="btn btn-ghost">Lihat paket</Link>
            </div>

            <div className="hero-stats">
              <div>
                <strong>60</strong>
                <span>Token free</span>
              </div>
              <div>
                <strong>20</strong>
                <span>Token per project</span>
              </div>
              <div>
                <strong>10.000</strong>
                <span>Token member</span>
              </div>
            </div>
          </div>

          <div className="glass-panel hero-card">
            <div className="mini-label">Auto Edit Preview</div>
            <div className="video-box">
              <div className="video-bar" />
              <div className="video-fragments">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="feature-list">
              <div>
                <strong>Auto Cut</strong>
                <small>AI menyusun highlight dan hook yang kuat.</small>
              </div>
              <div>
                <strong>Smart B-roll</strong>
                <small>Menyusun alur edit yang lebih halus dan penuh dinamika.</small>
              </div>
              <div>
                <strong>Upload YouTube</strong>
                <small>Proses langsung dari tautan video Anda.</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-block">
        <div className="section-heading">
          <span className="eyebrow">Kenapa IBAM</span>
          <h2>Proses edit video seperti punya editor profesional</h2>
        </div>
        <div className="grid-3">
          <article className="info-card">
            <h3>1. Input Link</h3>
            <p>Masukkan link YouTube dari video yang ingin diolah.</p>
          </article>
          <article className="info-card">
            <h3>2. AI Review</h3>
            <p>AI membaca konten, menganalisa momentum, dan memilih momen terbaik.</p>
          </article>
          <article className="info-card">
            <h3>3. Export Hasil</h3>
            <p>Video hasil edit siap diposting dengan kualitas yang lebih rapi.</p>
          </article>
        </div>
      </section>

      <section className="container section-block dark-block">
        <div className="section-heading">
          <span className="eyebrow">Paket</span>
          <h2>Pilih metode akun yang paling cocok</h2>
        </div>
        <div className="grid-3 pricing-strip">
          <div className="pricing-card">
            <span className="pill free">Free</span>
            <h3>60 Token</h3>
            <p>Cocok untuk mencoba fitur dasar.</p>
            <ul>
              <li>Gratis</li>
              <li>20 token tiap project</li>
            </ul>
          </div>
          <div className="pricing-card featured">
            <span className="pill member">Member</span>
            <h3>10.000 Token</h3>
            <p>Untuk kebutuhan edit lebih banyak dan nonstop.</p>
            <ul>
              <li>Biaya: Rp200.000/bulan</li>
              <li>Pembayaran via QRIS</li>
            </ul>
          </div>
          <div className="pricing-card">
            <span className="pill dev">Developer</span>
            <h3>Unlimited</h3>
            <p>Bagi akun khusus pengembang dan admin.</p>
            <ul>
              <li>Token tak terbatas</li>
              <li>Akses penuh</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

function AuthPage({ mode, login, register, googleLogin }) {
  const [form, setForm] = useState({ username: '', email: '', name: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isLogin = mode === 'login';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await login({ username: form.username || form.email, password: form.password });
      } else {
        await register({
          name: form.name,
          username: form.username,
          email: form.email,
          password: form.password,
        });
      }
      navigate('/dashboard');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Login gagal. Coba lagi.');
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      navigate('/dashboard');
    } catch {
      setError('Google login gagal. Silakan coba nanti.');
    }
  };

  return (
    <main className="container auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <span className="eyebrow">{isLogin ? 'Masuk ke akun' : 'Buat akun baru'}</span>
          <h2>{isLogin ? 'Selamat datang kembali' : 'Mulai edit dengan AI'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          {!isLogin && (
            <label>
              Nama lengkap
              <input name="name" value={form.name} onChange={handleChange} placeholder="Nama Anda" required />
            </label>
          )}

          <label>
            {isLogin ? 'Username atau email' : 'Username'}
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder={isLogin ? 'develop atau email' : 'username Anda'}
              required
            />
          </label>

          {!isLogin && (
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
            </label>
          )}

          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required />
          </label>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="btn btn-primary btn-block">
            {isLogin ? 'Masuk' : 'Daftar'}
          </button>
        </form>

        <div className="divider"><span>atau</span></div>

        <button type="button" className="btn btn-secondary btn-block" onClick={handleGoogle}>
          Login dengan Google
        </button>

        <p className="auth-switch">
          {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
          <Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'Daftar sekarang' : 'Masuk di sini'}</Link>
        </p>

        <div className="admin-login-note">
          <strong>Admin demo:</strong> username: <code>develop</code> password: <code>iqbal2008</code>
        </div>
      </div>
    </main>
  );
}

function PricingPage({ user, upgradeMember }) {
  const handleMemberUpgrade = async () => {
    if (!user) return;
    try {
      await upgradeMember();
      alert('Akun Anda berhasil diubah menjadi member.');
    } catch (error) {
      alert(error.response?.data?.message || 'Upgrade gagal.');
    }
  };

  return (
    <main className="container section-block pricing-page">
      <div className="section-heading">
        <span className="eyebrow">Pilih paket</span>
        <h2>Kelola token sesuai kebutuhan</h2>
      </div>

      <div className="grid-3 pricing-strip">
        <div className="pricing-card">
          <span className="pill free">Free</span>
          <h3>60 Token</h3>
          <p>Cocok untuk mencoba. Setiap project menghabiskan 20 token.</p>
          <ul>
            <li>Gratis</li>
            <li>20 token per project</li>
          </ul>
        </div>

        <div className="pricing-card featured">
          <span className="pill member">Member</span>
          <h3>10.000 Token</h3>
          <p>Untuk kebutuhan edit lebih banyak dan akses cepat.</p>
          <ul>
            <li>Biaya: Rp200.000 / bulan</li>
            <li>Pembayaran via QRIS</li>
            <li>Potensi edit lebih banyak</li>
          </ul>
          {user && user.role !== 'member' && user.role !== 'developer' && (
            <button className="btn btn-primary btn-block" onClick={handleMemberUpgrade}>Upgrade ke member</button>
          )}
        </div>

        <div className="pricing-card">
          <span className="pill dev">Developer</span>
          <h3>Unlimited</h3>
          <p>Hak akses pengembang resmi.</p>
          <ul>
            <li>Token tak terbatas</li>
            <li>Akses admin penuh</li>
          </ul>
        </div>
      </div>

      <div className="qris-box">
        <div>
          <span className="eyebrow">Pembayaran QRIS</span>
          <h3>QRIS member akan diaktifkan saat website sudah siap</h3>
          <p>Fitur ini akan segera ditambahkan untuk proses pembayaran member yang lebih aman dan cepat.</p>
        </div>
        <div className="qris-qr-placeholder">QRIS</div>
      </div>
    </main>
  );
}

function DashboardPage({ user, projects }) {
  const tokenText = user.role === 'developer' ? 'Unlimited' : `${user.tokens ?? 0}`;

  return (
    <main className="container section-block dashboard-page">
      <div className="dashboard-top">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h2>Halo, {user.name || user.username}</h2>
        </div>
        <div className="token-box">
          <small>Saldo token</small>
          <strong>{tokenText}</strong>
        </div>
      </div>

      <div className="grid-3 dashboard-cards">
        <div className="info-card">
          <small>Role</small>
          <h3>{user.role}</h3>
        </div>
        <div className="info-card">
          <small>Total project</small>
          <h3>{projects.length}</h3>
        </div>
        <div className="info-card">
          <small>Plan</small>
          <h3>{user.role === 'free' ? 'Free' : user.role === 'member' ? 'Member' : 'Developer'}</h3>
        </div>
      </div>

      <div className="panel-box">
        <div className="panel-header">
          <h3>Ringkasan AI</h3>
          <Link to="/projects" className="btn btn-primary btn-small">Buat project baru</Link>
        </div>
        <p>
          Sistem akan otomatis mengolah link YouTube Anda. Setiap project baru menghabiskan <strong>20 token</strong> untuk akun free dan member, sementara developer mendapatkan akses tak terbatas.
        </p>
      </div>
    </main>
  );
}

function ProjectsPage({ user, createProject, projects, loadingProjects, loadProjects }) {
  const [form, setForm] = useState({ title: '', youtubeUrl: '', prompt: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await createProject({
        title: form.title,
        youtubeUrl: form.youtubeUrl,
        prompt: form.prompt,
      });
      setForm({ title: '', youtubeUrl: '', prompt: '' });
      await loadProjects();
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Project gagal dibuat.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container section-block projects-page">
      <div className="form-layout">
        <div className="panel-box">
          <div className="panel-header">
            <h3>Buat project AI</h3>
          </div>
          <form onSubmit={handleSubmit} className="form-grid compact">
            <label>
              Judul project
              <input name="title" value={form.title} onChange={handleChange} placeholder="Contoh: Vlog highlight hari pertama" required />
            </label>
            <label>
              Link YouTube
              <input name="youtubeUrl" value={form.youtubeUrl} onChange={handleChange} placeholder="https://youtube.com/watch?v=..." required />
            </label>
            <label>
              Prompt edit AI
              <textarea name="prompt" value={form.prompt} onChange={handleChange} placeholder="Jelaskan gaya edit yang Anda inginkan..." rows="5" required />
            </label>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Memproses...' : 'Mulai AI Edit'}
            </button>
          </form>
        </div>

        <div className="panel-box">
          <div className="panel-header">
            <h3>Project Anda</h3>
            <button type="button" className="btn btn-secondary btn-small" onClick={loadProjects}>Refresh</button>
          </div>

          {loadingProjects ? (
            <p>Memuat project...</p>
          ) : projects.length === 0 ? (
            <p>Belum ada project. Buat project baru untuk mulai edit.</p>
          ) : (
            <div className="project-list">
              {projects.map((project) => (
                <Link key={project.id} to={`/project/${project.id}`} className="project-card">
                  <div className="project-card-header">
                    <strong>{project.title}</strong>
                    <span className="status-badge">{project.status}</span>
                  </div>
                  <small>{project.youtube_url}</small>
                  <p>{project.prompt}</p>
                  <span>{project.tokens_used} token</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function ProjectDetailPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${projectId}`, { headers: appApiHeaders() });
        setProject(response.data.project);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) return <main className="container section-block"><p>Memuat detail project...</p></main>;
  if (!project) return <main className="container section-block"><p>Project tidak ditemukan.</p></main>;

  return (
    <main className="container section-block project-detail">
      <div className="panel-box">
        <div className="panel-header">
          <h2>{project.title}</h2>
          <span className="status-badge">{project.status}</span>
        </div>

        <div className="detail-grid">
          <div>
            <small>Link YouTube</small>
            <p>{project.youtube_url}</p>
          </div>
          <div>
            <small>Token dipakai</small>
            <p>{project.tokens_used}</p>
          </div>
        </div>

        <div className="editor-output">
          <h3>Prompt AI</h3>
          <p>{project.prompt}</p>
        </div>

        <div className="editor-output">
          <h3>Hasil draft</h3>
          <p>
            AI sedang menganalisa konten video Anda. Hasil edit akan dibuat dengan gaya hook kuat, transisi yang halus, intro lebih menarik, dan pacing yang lebih dinamis sesuai instruksi Anda.
          </p>
        </div>
      </div>
    </main>
  );
}

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/auth/users', { headers: appApiHeaders() });
        setUsers(response.data.users || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <main className="container section-block admin-page">
      <div className="section-heading">
        <span className="eyebrow">Admin panel</span>
        <h2>Kelola pengguna dan akses</h2>
      </div>

      {loading ? (
        <p>Memuat data admin...</p>
      ) : (
        <div className="panel-box">
          <div className="panel-header">
            <h3>Daftar pengguna</h3>
          </div>
          <div className="user-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Token</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name || '-'}</td>
                    <td>{item.username}</td>
                    <td>{item.role}</td>
                    <td>{item.role === 'developer' ? 'Unlimited' : item.tokens}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}

function AccountPage({ user, upgradeMember }) {
  const handleUpgrade = async () => {
    try {
      await upgradeMember();
      alert('Akun Anda naik ke member.');
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || 'Upgrade gagal.');
    }
  };

  return (
    <main className="container section-block account-page">
      <div className="panel-box">
        <div className="panel-header">
          <h2>Account</h2>
        </div>

        <div className="account-grid">
          <div>
            <small>Nama</small>
            <h3>{user.name || user.username}</h3>
          </div>
          <div>
            <small>Email</small>
            <h3>{user.email || 'Tidak tersedia'}</h3>
          </div>
          <div>
            <small>Role</small>
            <h3>{user.role}</h3>
          </div>
          <div>
            <small>Token</small>
            <h3>{user.role === 'developer' ? 'Unlimited' : user.tokens}</h3>
          </div>
        </div>

        {user.role !== 'member' && user.role !== 'developer' && (
          <button className="btn btn-primary" onClick={handleUpgrade}>Upgrade ke member</button>
        )}
      </div>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="container section-block not-found">
      <h2>404</h2>
      <p>Halaman tidak ditemukan.</p>
      <Link to="/" className="btn btn-primary">Kembali ke home</Link>
    </main>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-wrap">
        <p>© 2026 IBAM Auto Edit</p>
        <p>Created by M.IQBAL APRILIAN NASRI</p>
      </div>
    </footer>
  );
}

export default App;
