import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.grid} />
      <div style={s.container}>
        <div style={s.badge}>JWT AUTH SYSTEM</div>
        <h1 style={s.title}>SIGN IN</h1>
        <p style={s.subtitle}>Enter your credentials to access the system</p>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>EMAIL_ADDRESS</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="user@domain.com" style={s.input} required autoFocus />
          </div>
          <div style={s.field}>
            <label style={s.label}>PASSWORD</label>
            <input type="password" name="password" value={form.password} onChange={handleChange}
              placeholder="••••••••" style={s.input} required />
          </div>

          {error && <div style={s.error}>⚠ {error}</div>}

          <button type="submit" disabled={loading}
            style={{ ...s.button, ...(loading ? s.btnDisabled : {}) }}>
            {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE →'}
          </button>
        </form>

        <div style={s.footer}>
          <span style={s.footerText}>No account?</span>
          <Link to="/register" style={s.link}>CREATE ONE →</Link>
        </div>

        <div style={s.flow}>
          {['USER','LOGIN','JWT TOKEN','ACCESS'].map((step, i, arr) => (
            <span key={step} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={s.flowBox}>{step}</span>
              {i < arr.length - 1 && <span style={s.arrow}>→</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Mono', monospace", position: 'relative', overflow: 'hidden' },
  grid: { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,255,157,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,157,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' },
  container: { width: '100%', maxWidth: '420px', padding: '48px 40px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,255,157,0.2)', position: 'relative', zIndex: 1 },
  badge: { display: 'inline-block', padding: '4px 10px', background: 'rgba(0,255,157,0.1)', border: '1px solid rgba(0,255,157,0.3)', color: '#00ff9d', fontSize: '10px', letterSpacing: '3px', marginBottom: '24px' },
  title: { margin: '0 0 8px 0', color: '#fff', fontSize: '36px', fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: '4px' },
  subtitle: { margin: '0 0 36px 0', color: '#4a4a6a', fontSize: '12px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: '#00ff9d', fontSize: '10px', letterSpacing: '2px', fontWeight: 700 },
  input: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 16px', color: '#fff', fontSize: '14px', fontFamily: "'Space Mono', monospace", outline: 'none', width: '100%', boxSizing: 'border-box' },
  error: { padding: '12px 14px', background: 'rgba(255,50,50,0.08)', border: '1px solid rgba(255,50,50,0.3)', color: '#ff6b6b', fontSize: '12px' },
  button: { padding: '16px', background: '#00ff9d', border: 'none', color: '#0a0a0f', fontSize: '13px', fontFamily: "'Space Mono', monospace", fontWeight: 700, letterSpacing: '2px', cursor: 'pointer', marginTop: '8px' },
  btnDisabled: { background: 'rgba(0,255,157,0.3)', color: '#00ff9d', cursor: 'not-allowed' },
  footer: { marginTop: '28px', display: 'flex', gap: '12px', alignItems: 'center' },
  footerText: { color: '#4a4a6a', fontSize: '12px' },
  link: { color: '#00ff9d', textDecoration: 'none', fontSize: '12px', fontWeight: 700 },
  flow: { marginTop: '36px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' },
  flowBox: { padding: '4px 8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#4a4a6a', fontSize: '9px', letterSpacing: '1px' },
  arrow: { color: '#00ff9d', fontSize: '10px', opacity: 0.5 },
};

export default LoginPage;