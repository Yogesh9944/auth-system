import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const getStrength = (pwd) => {
  if (!pwd) return null;
  if (pwd.length < 6) return { pct: 20, label: 'TOO SHORT', color: '#ff4444' };
  const score = [pwd.length >= 8, /[A-Z]/.test(pwd), /[0-9]/.test(pwd), /[^A-Za-z0-9]/.test(pwd)].filter(Boolean).length;
  return [
    { pct: 25, label: 'WEAK',   color: '#ff4444' },
    { pct: 50, label: 'FAIR',   color: '#ff9900' },
    { pct: 75, label: 'GOOD',   color: '#ffdd00' },
    { pct: 100, label: 'STRONG', color: '#00ff9d' },
  ][score - 1] || { pct: 25, label: 'WEAK', color: '#ff4444' };
};

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => { setForm((p) => ({ ...p, [e.target.name]: e.target.value })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await register({ username: form.username, email: form.email, password: form.password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(form.password);

  return (
    <div style={s.page}>
      <div style={s.grid} />
      <div style={s.container}>
        <div style={s.badge}>NEW ACCOUNT</div>
        <h1 style={s.title}>REGISTER</h1>
        <p style={s.subtitle}>Create your account to get started</p>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>USERNAME</label>
            <input name="username" value={form.username} onChange={handleChange} placeholder="johndoe" style={s.input} minLength={3} required autoFocus />
          </div>
          <div style={s.field}>
            <label style={s.label}>EMAIL_ADDRESS</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="user@domain.com" style={s.input} required />
          </div>
          <div style={s.field}>
            <label style={s.label}>PASSWORD</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="min. 6 characters" style={s.input} minLength={6} required />
            {strength && <>
              <div style={s.bar}><div style={{ ...s.barFill, width: `${strength.pct}%`, background: strength.color }} /></div>
              <span style={{ fontSize: '9px', letterSpacing: '2px', color: strength.color }}>{strength.label}</span>
            </>}
          </div>
          <div style={s.field}>
            <label style={s.label}>CONFIRM_PASSWORD</label>
            <input type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="repeat password"
              style={{ ...s.input, borderColor: form.confirm ? (form.password === form.confirm ? 'rgba(0,255,157,0.4)' : 'rgba(255,80,80,0.5)') : undefined }}
              required />
          </div>

          {error && <div style={s.error}>⚠ {error}</div>}

          <button type="submit" disabled={loading} style={{ ...s.button, ...(loading ? s.btnDisabled : {}) }}>
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT →'}
          </button>
        </form>

        <div style={s.footer}>
          <span style={s.footerText}>Already registered?</span>
          <Link to="/login" style={s.link}>SIGN IN →</Link>
        </div>
        <div style={s.note}>🔒 Passwords hashed with bcrypt · 12 salt rounds</div>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Mono', monospace", position: 'relative', padding: '40px 20px' },
  grid: { position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(0,255,157,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,157,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' },
  container: { width: '100%', maxWidth: '420px', padding: '48px 40px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,255,157,0.2)', position: 'relative', zIndex: 1 },
  badge: { display: 'inline-block', padding: '4px 10px', background: 'rgba(0,255,157,0.1)', border: '1px solid rgba(0,255,157,0.3)', color: '#00ff9d', fontSize: '10px', letterSpacing: '3px', marginBottom: '24px' },
  title: { margin: '0 0 8px 0', color: '#fff', fontSize: '36px', fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: '4px' },
  subtitle: { margin: '0 0 36px 0', color: '#4a4a6a', fontSize: '12px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: '#00ff9d', fontSize: '10px', letterSpacing: '2px', fontWeight: 700 },
  input: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 16px', color: '#fff', fontSize: '14px', fontFamily: "'Space Mono', monospace", outline: 'none', width: '100%', boxSizing: 'border-box', transition: 'border-color 0.2s' },
  bar: { height: '2px', background: 'rgba(255,255,255,0.05)' },
  barFill: { height: '100%', transition: 'width 0.3s, background 0.3s' },
  error: { padding: '12px 14px', background: 'rgba(255,50,50,0.08)', border: '1px solid rgba(255,50,50,0.3)', color: '#ff6b6b', fontSize: '12px' },
  button: { padding: '16px', background: '#00ff9d', border: 'none', color: '#0a0a0f', fontSize: '13px', fontFamily: "'Space Mono', monospace", fontWeight: 700, letterSpacing: '2px', cursor: 'pointer', marginTop: '8px' },
  btnDisabled: { background: 'rgba(0,255,157,0.3)', color: '#00ff9d', cursor: 'not-allowed' },
  footer: { marginTop: '28px', display: 'flex', gap: '12px', alignItems: 'center' },
  footerText: { color: '#4a4a6a', fontSize: '12px' },
  link: { color: '#00ff9d', textDecoration: 'none', fontSize: '12px', fontWeight: 700 },
  note: { marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#2a2a4a', fontSize: '10px', letterSpacing: '1px' },
};

export default RegisterPage;