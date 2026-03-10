import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { protectedAPI } from '../utils/api';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [result, setResult] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const token = localStorage.getItem('accessToken');

  const handleLogout = () => { logout(); navigate('/login'); };

  const callAPI = async (key) => {
    setApiLoading(true); setApiError(''); setResult(null);
    try {
      const res = key === 'dashboard' ? await protectedAPI.getDashboard()
                : key === 'profile'   ? await protectedAPI.getProfile()
                :                       await protectedAPI.getSecret();
      setResult(res.data);
    } catch (err) {
      setApiError(err.response?.data?.message || 'API call failed');
    } finally { setApiLoading(false); }
  };

  const decodePayload = (t) => {
    try { return JSON.stringify(JSON.parse(atob(t.split('.')[1])), null, 2); }
    catch { return '—'; }
  };

  return (
    <div style={s.page}>
      <div style={s.grid} />
      <nav style={s.nav}>
        <div style={s.logo}><span style={s.dot} /><span style={s.logoText}>JWT_AUTH</span></div>
        <div style={s.navRight}>
          <span style={s.roleBadge}>{user?.role?.toUpperCase()}</span>
          <span style={s.userName}>{user?.username}</span>
          <button onClick={handleLogout} style={s.logoutBtn}>SIGN OUT</button>
        </div>
      </nav>

      <div style={s.container}>
        <p style={s.greeting}>WELCOME BACK,</p>
        <h1 style={s.title}>{user?.username?.toUpperCase()}</h1>
        <p style={s.statusLine}><span style={s.statusDot} /> Session active · Authenticated via JWT</p>

        <div style={s.tabs}>
          {['overview', 'token', 'api'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}>
              {t === 'overview' ? 'OVERVIEW' : t === 'token' ? 'JWT TOKEN' : 'API EXPLORER'}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div>
            <div style={s.cards}>
              {[
                { label: 'USER ID',  value: user?.id?.slice(0,18)+'...', accent: '#00ff9d' },
                { label: 'EMAIL',    value: user?.email,                  accent: '#7b61ff' },
                { label: 'ROLE',     value: user?.role?.toUpperCase(),    accent: '#ff6b6b' },
                { label: 'JOINED',   value: new Date(user?.createdAt).toLocaleDateString(), accent: '#ffdd00' },
              ].map(({ label, value, accent }) => (
                <div key={label} style={{ ...s.card, borderColor: `${accent}22` }}>
                  <span style={{ ...s.cardLabel, color: accent }}>{label}</span>
                  <span style={s.cardValue}>{value}</span>
                </div>
              ))}
            </div>
            <p style={s.sectionTitle}>AUTH FLOW</p>
            <div style={s.flow}>
              {['CLIENT','POST /login','SERVER','JWT TOKEN','Bearer Header','PROTECTED ROUTE','200 OK'].map((step, i, arr) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={s.flowBox}>{step}</span>
                  {i < arr.length - 1 && <span style={s.arrow}>→</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* TOKEN */}
        {tab === 'token' && (
          <div>
            <p style={s.sectionTitle}>DECODED JWT</p>
            <div style={s.tokenBox}>
              {[
                { label: 'HEADER',  value: token ? atob(token.split('.')[0]) : '—', color: '#ff6b6b' },
                { label: 'PAYLOAD', value: token ? decodePayload(token) : '—',       color: '#7b61ff' },
              ].map(({ label, value, color }, i) => (
                <div key={i}>
                  {i > 0 && <div style={s.divider} />}
                  <p style={{ ...s.tokenLabel }}>{label}</p>
                  <pre style={{ ...s.tokenValue, color }}>{value}</pre>
                </div>
              ))}
              <div style={s.divider} />
              <p style={s.tokenLabel}>RAW TOKEN</p>
              <pre style={{ ...s.tokenValue, color: '#00ff9d', fontSize: '10px', wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>{token || '—'}</pre>
            </div>
            <p style={s.hint}>ⓘ The signature is cryptographically verified server-side on every request.</p>
          </div>
        )}

        {/* API EXPLORER */}
        {tab === 'api' && (
          <div>
            <p style={s.sectionTitle}>PROTECTED ENDPOINTS</p>
            {[
              { method: 'GET', path: '/api/protected/dashboard', key: 'dashboard', desc: 'Returns dashboard data' },
              { method: 'GET', path: '/api/protected/profile',   key: 'profile',   desc: 'Returns user profile' },
              { method: 'GET', path: '/api/protected/secret',    key: 'secret',    desc: 'Returns a secret resource' },
            ].map((ep) => (
              <div key={ep.key} style={s.endpoint}>
                <div style={s.endpointLeft}>
                  <span style={s.method}>{ep.method}</span>
                  <div>
                    <div style={s.endpointPath}>{ep.path}</div>
                    <div style={s.endpointDesc}>{ep.desc}</div>
                  </div>
                </div>
                <button onClick={() => callAPI(ep.key)} style={s.callBtn}>CALL →</button>
              </div>
            ))}
            {apiLoading && <p style={{ color: '#4a4a6a', fontSize: '12px', marginTop: '16px', letterSpacing: '2px' }}>FETCHING...</p>}
            {apiError  && <div style={s.apiError}>⚠ {apiError}</div>}
            {result && (
              <div style={s.apiResult}>
                <div style={s.apiResultHeader}><span style={{ color: '#00ff9d' }}>200 OK</span><span style={{ color: '#4a4a6a' }}>RESPONSE</span></div>
                <pre style={s.pre}>{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', background: '#0a0a0f', fontFamily: "'Space Mono', monospace", position: 'relative' },
  grid: { position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(0,255,157,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,157,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.4)', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(10px)' },
  logo: { display: 'flex', alignItems: 'center', gap: '10px' },
  dot: { width: '8px', height: '8px', background: '#00ff9d', borderRadius: '50%', display: 'inline-block' },
  logoText: { color: '#fff', fontSize: '14px', fontWeight: 700, letterSpacing: '3px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  roleBadge: { padding: '3px 8px', background: 'rgba(0,255,157,0.1)', border: '1px solid rgba(0,255,157,0.2)', color: '#00ff9d', fontSize: '9px', letterSpacing: '2px' },
  userName: { color: '#fff', fontSize: '12px' },
  logoutBtn: { padding: '8px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#4a4a6a', fontSize: '10px', fontFamily: "'Space Mono', monospace", cursor: 'pointer', letterSpacing: '1px' },
  container: { maxWidth: '900px', margin: '0 auto', padding: '48px 40px', position: 'relative', zIndex: 1 },
  greeting: { color: '#4a4a6a', fontSize: '11px', letterSpacing: '3px', marginBottom: '8px' },
  title: { color: '#fff', fontSize: '48px', fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: '4px', marginBottom: '12px' },
  statusLine: { color: '#2a2a4a', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' },
  statusDot: { display: 'inline-block', width: '6px', height: '6px', background: '#00ff9d', borderRadius: '50%' },
  tabs: { display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '32px' },
  tab: { padding: '12px 24px', background: 'transparent', border: 'none', borderBottom: '2px solid transparent', color: '#4a4a6a', fontSize: '11px', fontFamily: "'Space Mono', monospace", letterSpacing: '2px', cursor: 'pointer', marginBottom: '-1px' },
  tabActive: { color: '#00ff9d', borderBottomColor: '#00ff9d' },
  cards: { display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '36px' },
  card: { padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid', flex: '1 1 180px' },
  cardLabel: { display: 'block', fontSize: '10px', letterSpacing: '2px', marginBottom: '10px' },
  cardValue: { display: 'block', color: '#fff', fontSize: '13px', wordBreak: 'break-all' },
  sectionTitle: { color: '#4a4a6a', fontSize: '10px', letterSpacing: '3px', marginBottom: '16px' },
  flow: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' },
  flowBox: { padding: '8px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#fff', fontSize: '10px', letterSpacing: '1px' },
  arrow: { color: '#00ff9d', opacity: 0.4 },
  tokenBox: { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', padding: '24px', marginBottom: '16px' },
  tokenLabel: { fontSize: '9px', letterSpacing: '2px', color: '#4a4a6a', marginBottom: '8px' },
  tokenValue: { margin: 0, fontSize: '12px', lineHeight: 1.6 },
  divider: { height: '1px', background: 'rgba(255,255,255,0.05)', margin: '20px 0' },
  hint: { color: '#2a2a4a', fontSize: '11px', lineHeight: 1.7 },
  endpoint: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '12px' },
  endpointLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  method: { color: '#00ff9d', fontSize: '10px', letterSpacing: '1px', fontWeight: 700 },
  endpointPath: { color: '#fff', fontSize: '12px', marginBottom: '4px' },
  endpointDesc: { color: '#4a4a6a', fontSize: '10px', letterSpacing: '1px' },
  callBtn: { padding: '8px 16px', background: 'rgba(0,255,157,0.08)', border: '1px solid rgba(0,255,157,0.2)', color: '#00ff9d', fontSize: '10px', fontFamily: "'Space Mono', monospace", cursor: 'pointer', letterSpacing: '1px' },
  apiError: { padding: '12px 16px', background: 'rgba(255,50,50,0.08)', border: '1px solid rgba(255,50,50,0.2)', color: '#ff6b6b', fontSize: '12px', marginTop: '16px' },
  apiResult: { background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,255,157,0.15)', marginTop: '16px' },
  apiResultHeader: { display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '10px', letterSpacing: '2px' },
  pre: { padding: '16px', margin: 0, color: '#7b9fbf', fontSize: '12px', overflowX: 'auto', lineHeight: 1.7 },
};

export default DashboardPage;