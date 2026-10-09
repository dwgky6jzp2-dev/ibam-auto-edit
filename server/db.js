@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

:root {
  --bg: #07111f;
  --bg-soft: #0d1a2d;
  --panel: rgba(18, 33, 53, 0.9);
  --panel-strong: #12253f;
  --line: rgba(135, 179, 255, 0.22);
  --text: #edf4ff;
  --muted: #a7bed8;
  --primary: #7c9cff;
  --primary-strong: #4b7dff;
  --accent: #4de2c2;
  --danger: #ff6b7d;
  --warning: #ffc857;
  --shadow: 0 30px 60px rgba(6, 11, 23, 0.45);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  background:
    radial-gradient(circle at top left, rgba(99, 124, 255, 0.2), transparent 28%),
    radial-gradient(circle at bottom right, rgba(77, 226, 194, 0.18), transparent 18%),
    var(--bg);
  color: var(--text);
}

img {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

code {
  font-family: 'SFMono-Regular', Consolas, monospace;
}

#root {
  min-height: 100vh;
}

.app-shell {
  min-height: 100vh;
}

.container {
  width: min(1200px, calc(100% - 32px));
  margin: 0 auto;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(20px);
  background: rgba(7, 17, 31, 0.7);
  border-bottom: 1px solid var(--line);
}

.nav-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 82px;
  gap: 18px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #061120;
  font-weight: 900;
}

.nav {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
}

.nav-link {
  color: var(--muted);
  font-weight: 600;
  transition: 0.2s ease;
}

.nav-link.active,
.nav-link:hover {
  color: var(--text);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: 14px;
  min-height: 48px;
  padding: 0 18px;
  font-weight: 700;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #081826;
  box-shadow: 0 18px 30px rgba(76, 129, 255, 0.38);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
  color: var(--text);
}

.btn-ghost {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.08);
  color: var(--text);
}

.btn-small {
  min-height: 36px;
  padding: 0 12px;
  font-size: 0.9rem;
}

.btn-block {
  width: 100%;
}

.hero {
  padding: 80px 0 48px;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 42px;
  align-items: center;
}

.eyebrow {
  display: inline-flex;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(124, 156, 255, 0.1);
  border: 1px solid rgba(124, 156, 255, 0.2);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #dbe7ff;
}

h1 {
  margin: 18px 0 18px;
  font-size: clamp(2.5rem, 5vw, 5rem);
  line-height: 1.02;
  letter-spacing: -0.06em;
}

h1 span {
  color: var(--accent);
}

.hero p {
  color: var(--muted);
  font-size: 1.08rem;
  max-width: 620px;
  line-height: 1.7;
}

.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 28px;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 28px;
}

.hero-stats div {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 18px;
}

.hero-stats strong {
  display: block;
  font-size: 1.6rem;
  letter-spacing: -0.04em;
}

.hero-stats span {
  color: var(--muted);
}

.glass-panel,
.info-card,
.panel-box,
.pricing-card,
.auth-card {
  background: rgba(12, 23, 39, 0.9);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
}

.hero-card {
  border-radius: 28px;
  padding: 24px;
}

.mini-label {
  display: inline-flex;
  margin-bottom: 16px;
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(77, 226, 194, 0.1);
  color: var(--accent);
  border: 1px solid rgba(77, 226, 194, 0.2);
  font-size: 0.76rem;
  font-weight: 700;
}

.video-box {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  height: 280px;
  background: linear-gradient(135deg, rgba(124, 156, 255, 0.3), rgba(77, 226, 194, 0.18), rgba(11, 20, 34, 0.96));
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.video-bar {
  position: absolute;
  inset: 18px 18px auto 18px;
  height: 24px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
}

.video-fragments {
  position: absolute;
  inset: auto 18px 18px 18px;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1.1fr;
  gap: 12px;
}

.video-fragments span {
  display: block;
  height: 120px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(124, 156, 255, 0.3));
}

.feature-list {
  margin-top: 18px;
  display: grid;
  gap: 14px;
}

.feature-list div {
  display: grid;
  gap: 4px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.feature-list strong {
  font-size: 1rem;
}

.feature-list small {
  color: var(--muted);
  line-height: 1.5;
}

.section-block {
  padding: 42px 0 72px;
}

.section-heading {
  margin-bottom: 24px;
}

.section-heading h2 {
  margin-top: 14px;
  font-size: clamp(2rem, 3vw, 3rem);
  letter-spacing: -0.05em;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.info-card {
  padding: 24px;
  border-radius: 22px;
}

.info-card h3,
.pricing-card h3,
.panel-box h3,
.auth-card h2,
.dashboard-top h2 {
  margin: 0 0 10px;
  letter-spacing: -0.04em;
}

.info-card p,
.pricing-card p,
.panel-box p,
.auth-card p,
.project-card p,
.editor-output p {
  color: var(--muted);
  line-height: 1.7;
}

.dark-block {
  background: rgba(10, 17, 29, 0.7);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.pricing-strip {
  margin-top: 20px;
}

.pricing-card {
  padding: 26px 22px;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pricing-card.featured {
  border-color: rgba(124, 156, 255, 0.5);
  transform: translateY(-8px);
}

.pricing-card ul {
  display: grid;
  gap: 8px;
  padding-left: 18px;
  color: var(--muted);
  margin: 4px 0 0;
}

.pill {
  width: fit-content;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 800;
}

.pill.free {
  background: rgba(77, 226, 194, 0.1);
  color: var(--accent);
}

.pill.member {
  background: rgba(124, 156, 255, 0.12);
  color: #dfe6ff;
}

.pill.dev {
  background: rgba(255, 200, 87, 0.1);
  color: var(--warning);
}

.auth-page {
  padding: 72px 0;
}

.auth-card {
  max-width: 520px;
  margin: 0 auto;
  border-radius: 26px;
  padding: 28px;
}

.auth-heading {
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  gap: 18px;
}

.form-grid.compact {
  gap: 14px;
}

label {
  display: grid;
  gap: 8px;
  color: var(--muted);
  font-weight: 600;
}

input,
textarea {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  min-height: 46px;
  padding: 0 14px;
  color: var(--text);
  outline: none;
}

textarea {
  min-height: 120px;
  padding: 12px 14px;
  resize: vertical;
}

input:focus,
textarea:focus {
  border-color: rgba(124, 156, 255, 0.85);
  box-shadow: 0 0 0 4px rgba(124, 156, 255, 0.12);
}

.form-error {
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 107, 125, 0.12);
  color: #ffb5bd;
  border: 1px solid rgba(255, 107, 125, 0.4);
}

.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--muted);
  margin: 20px 0 16px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

.auth-switch {
  margin-top: 18px;
  text-align: center;
  color: var(--muted);
}

.auth-switch a {
  color: var(--accent);
  font-weight: 700;
}

.admin-login-note {
  margin-top: 18px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(77, 226, 194, 0.08);
  border: 1px solid rgba(77, 226, 194, 0.2);
  color: var(--muted);
}

.pricing-page,
.dashboard-page,
.projects-page,
.admin-page,
.account-page,
.project-detail {
  min-height: 60vh;
}

.qris-box {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 18px;
  margin-top: 32px;
  padding: 24px;
  border-radius: 24px;
  border: 1px solid var(--line);
  background: rgba(10, 17, 29, 0.7);
}

.qris-qr-placeholder {
  display: grid;
  place-items: center;
  min-height: 160px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(124, 156, 255, 0.18));
  border: 1px dashed rgba(124, 156, 255, 0.4);
  color: var(--primary-strong);
  font-weight: 800;
  font-size: 2rem;
  letter-spacing: 0.2em;
}

.dashboard-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 20px;
}

.token-box {
  min-width: 180px;
  padding: 18px 20px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(124, 156, 255, 0.16), rgba(77, 226, 194, 0.12));
  border: 1px solid var(--line);
}

.token-box small {
  display: block;
  color: var(--muted);
}

.token-box strong {
  font-size: 2rem;
  letter-spacing: -0.05em;
}

.dashboard-cards,
.account-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.account-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-bottom: 20px;
}

.panel-box {
  border-radius: 24px;
  padding: 22px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.form-layout {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 22px;
}

.project-list {
  display: grid;
  gap: 14px;
}

.project-card {
  display: grid;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.02);
}

.project-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.status-badge {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(77, 226, 194, 0.12);
  border: 1px solid rgba(77, 226, 194, 0.24);
  color: var(--accent);
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: capitalize;
}

.user-table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  text-align: left;
  padding: 12px 8px;
  color: var(--muted);
}

th {
  color: var(--text);
  font-weight: 700;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 18px;
  margin-bottom: 24px;
}

.detail-grid small,
.editor-output h3,
.account-grid small {
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
}

.editor-output {
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 18px;
}

.not-found {
  text-align: center;
  padding-top: 120px;
}

.site-footer {
  border-top: 1px solid var(--line);
  background: rgba(6, 13, 23, 0.8);
}

.footer-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 72px;
  color: var(--muted);
}

@media (max-width: 900px) {
  .hero-grid,
  .grid-3,
  .form-layout,
  .qris-box,
  .dashboard-cards,
  .account-grid {
    grid-template-columns: 1fr;
  }

  .nav-wrap {
    flex-wrap: wrap;
    padding: 16px 0;
  }

  .nav {
    width: 100%;
    justify-content: center;
  }

  .nav-actions {
    width: 100%;
    justify-content: center;
  }

  .dashboard-top {
    flex-direction: column;
    align-items: flex-start;
  }
}
