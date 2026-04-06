import { useState } from 'react';
import { FaShieldAlt, FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

/* ── LocalStorage user store ── */
const getUsers = () => {
  try { return JSON.parse(localStorage.getItem('ems-users') || '[]'); } catch { return []; }
};
const saveUsers = (u) => localStorage.setItem('ems-users', JSON.stringify(u));

/* ── Employee list helpers — same store that EmployeePage/admin uses ── */
const SEED_EMP = [
  { id:1, firstName:'Alice',  lastName:'Beck',    email:'alice.beck@example.com',    department:'Engineering', salary:97000, phone:'+1234567890' },
  { id:2, firstName:'Bob',    lastName:'Curtis',  email:'bob.curtis@example.com',    department:'Sales',       salary:81000, phone:'+1234567891' },
  { id:3, firstName:'Carol',  lastName:'Davis',   email:'carol.davis@example.com',   department:'HR',          salary:68000, phone:'+1234567892' },
  { id:4, firstName:'Daniel', lastName:'Edwards', email:'daniel.edwards@example.com',department:'Finance',     salary:87000, phone:'+1234567893' },
];
const getEmployees  = () => { try { return JSON.parse(localStorage.getItem('ems-employees') || 'null') || SEED_EMP; } catch { return SEED_EMP; } };
const saveEmployees = (list) => localStorage.setItem('ems-employees', JSON.stringify(list));

/* Seed default admin once */
(() => {
  const users = getUsers();
  if (!users.find(u => u.role === 'admin' && u.username === 'admin')) {
    saveUsers([...users, { name:'Administrator', email:'admin@ems.com', username:'admin', password:'admin123', role:'admin' }]);
  }
})();

/* ─────────────────────────────────────────────────────────────
   ALL helper components defined OUTSIDE LoginPage
   so React never remounts them on every keystroke
───────────────────────────────────────────────────────────── */

const Tab = ({ id, role, setRole, setError, setSuccess, children }) => (
  <button type="button" onClick={() => { setRole(id); setError(''); setSuccess(''); }}
    style={{
      flex:1, padding:'9px 0', border:'none', borderRadius:'9px', cursor:'pointer',
      fontFamily:'Outfit,sans-serif', fontWeight:600, fontSize:'13px',
      display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
      transition:'all 0.22s',
      background: role===id
        ? (id==='admin' ? 'linear-gradient(135deg,#4f46e5,#6366f1)' : 'linear-gradient(135deg,#0891b2,#06b6d4)')
        : 'transparent',
      color: role===id ? '#fff' : '#64748b',
      boxShadow: role===id ? '0 3px 12px rgba(0,0,0,0.35)' : 'none',
    }}>
    {children}
  </button>
);

const ModeTab = ({ id, label, mode, reset }) => (
  <button type="button" onClick={() => reset(id)}
    style={{
      flex:1, padding:'8px', border:'none', cursor:'pointer', borderRadius:'8px',
      fontFamily:'Outfit,sans-serif', fontWeight:600, fontSize:'13px',
      background: mode===id ? 'rgba(255,255,255,0.11)' : 'transparent',
      color: mode===id ? '#f1f5f9' : '#64748b', transition:'all 0.2s',
    }}>
    {label}
  </button>
);

const Field = ({ label, icon, type='text', value, onChange, placeholder, right, accent }) => (
  <div style={{ marginBottom:'13px' }}>
    <label style={{
      display:'block', color:'#94a3b8', fontSize:'12px', fontWeight:600,
      marginBottom:'6px', fontFamily:'Outfit,sans-serif', textTransform:'uppercase', letterSpacing:'0.5px',
    }}>
      {label}
    </label>
    <div style={{ position:'relative' }}>
      <span style={{
        position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)',
        color:'#475569', fontSize:'13px', pointerEvents:'none',
      }}>
        {icon}
      </span>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder} required
        style={{
          width:'100%', boxSizing:'border-box', background:'rgba(255,255,255,0.06)',
          border:'1px solid rgba(255,255,255,0.1)', color:'#f1f5f9', borderRadius:'10px',
          padding:'11px 14px 11px 40px', paddingRight: right ? '42px' : '14px',
          fontSize:'14px', fontFamily:'Outfit,sans-serif', outline:'none', transition:'all 0.2s',
        }}
        onFocus={e => { e.target.style.borderColor = accent+'99'; e.target.style.boxShadow = `0 0 0 3px ${accent}22`; e.target.style.background = 'rgba(255,255,255,0.09)'; }}
        onBlur={e  => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
      />
      {right}
    </div>
  </div>
);

const EyeBtn = ({ showPw, setShowPw }) => (
  <button type="button" onClick={() => setShowPw(p => !p)}
    style={{
      position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)',
      background:'none', border:'none', color:'#64748b', cursor:'pointer', fontSize:'14px',
    }}>
    {showPw ? <FaEyeSlash /> : <FaEye />}
  </button>
);

const SubmitBtn = ({ label, busy, isAdmin, accent }) => (
  <button type="submit" disabled={busy}
    style={{
      width:'100%', marginTop:'4px', padding:'13px', border:'none', borderRadius:'11px', cursor:'pointer',
      fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:'15px', color:'#fff', letterSpacing:'0.3px',
      background: isAdmin
        ? 'linear-gradient(135deg,#4f46e5,#6366f1)'
        : 'linear-gradient(135deg,#0891b2,#06b6d4)',
      boxShadow: `0 4px 18px ${accent}55`, transition:'all 0.2s', opacity: busy ? 0.7 : 1,
    }}>
    {busy
      ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'9px' }}>
          <span style={{ width:'16px', height:'16px', border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />
          Please wait…
        </span>
      : label}
  </button>
);

/* ─────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────── */
export default function LoginPage({ onLogin }) {
  const [mode, setMode]       = useState('login');
  const [role, setRole]       = useState('employee');
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy]       = useState(false);

  const [lf, setLf] = useState({ username:'', password:'' });
  const [rf, setRf] = useState({ name:'', email:'', username:'', password:'', confirm:'' });

  const reset = (newMode) => {
    setMode(newMode); setError(''); setSuccess(''); setShowPw(false);
    setLf({ username:'', password:'' });
    setRf({ name:'', email:'', username:'', password:'', confirm:'' });
  };

  /* ── LOGIN ── */
  const handleLogin = (e) => {
    e.preventDefault(); setError(''); setBusy(true);
    setTimeout(() => {
      const user = getUsers().find(u => u.username === lf.username && u.password === lf.password && u.role === role);
      if (user) {
        localStorage.setItem('ems-token',    'ok');
        localStorage.setItem('ems-role',     user.role);
        localStorage.setItem('ems-username', user.username);
        localStorage.setItem('ems-name',     user.name);
        localStorage.setItem('ems-email',    user.email || '');
        onLogin(user.role);
      } else {
        setError('Wrong username or password. Please try again.');
      }
      setBusy(false);
    }, 500);
  };

  /* ── REGISTER ── */
  const handleRegister = (e) => {
    e.preventDefault(); setError('');
    if (!rf.name.trim())                         return setError('Full name is required.');
    if (!/\S+@\S+\.\S+/.test(rf.email))          return setError('Enter a valid email address.');
    if (rf.username.trim().length < 3)            return setError('Username must be at least 3 characters.');
    if (rf.password.length < 6)                   return setError('Password must be at least 6 characters.');
    if (rf.password !== rf.confirm)               return setError('Passwords do not match.');

    setBusy(true);
    setTimeout(() => {
      const users = getUsers();
      if (users.find(u => u.username === rf.username)) { setError('Username already taken.'); setBusy(false); return; }
      if (users.find(u => u.email    === rf.email))    { setError('Email already registered. Please sign in.'); setBusy(false); return; }

      saveUsers([...users, {
        name: rf.name.trim(), email: rf.email.trim(),
        username: rf.username.trim(), password: rf.password, role,
      }]);

      // Also add to the employee records table so admin can see them immediately
      if (role === 'employee') {
        const empList   = getEmployees();
        const parts     = rf.name.trim().split(' ');
        const firstName = parts[0];
        const lastName  = parts.slice(1).join(' ') || '';
        const newId     = empList.length > 0 ? Math.max(...empList.map(e => e.id)) + 1 : 1;
        saveEmployees([...empList, {
          id: newId, firstName, lastName,
          email:      rf.email.trim(),
          department: 'Pending',
          salary:     0,
          phone:      'Not provided',
          username:   rf.username.trim(),
        }]);
      }

      setSuccess(`✅ Account created! Sign in as ${role === 'admin' ? 'Admin' : 'Employee'} now.`);
      setLf({ username: rf.username.trim(), password: '' });
      setMode('login');
      setBusy(false);
    }, 500);
  };

  const isAdmin = role === 'admin';
  const accentA = '#6366f1';
  const accentE = '#0891b2';
  const accent  = isAdmin ? accentA : accentE;

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg,#0f172a 0%,#1e1b4b 55%,#0f172a 100%)',
      position:'relative', overflow:'hidden',
    }}>
      {/* bg orbs */}
      <div style={{ position:'absolute',top:'-15%',left:'-8%',width:'550px',height:'550px',borderRadius:'50%',background:'radial-gradient(circle,rgba(79,70,229,0.18) 0%,transparent 70%)',pointerEvents:'none' }}/>
      <div style={{ position:'absolute',bottom:'-18%',right:'-8%',width:'480px',height:'480px',borderRadius:'50%',background:'radial-gradient(circle,rgba(8,145,178,0.13) 0%,transparent 70%)',pointerEvents:'none' }}/>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .ems-login-card { animation:fadeUp .4s ease forwards; }
      `}</style>

      <div className="ems-login-card" style={{
        width:'100%', maxWidth:'420px', margin:'20px 16px',
        background:'rgba(15,23,42,0.88)', backdropFilter:'blur(28px)',
        borderRadius:'22px', border:'1px solid rgba(255,255,255,0.09)',
        padding:'36px 32px', boxShadow:'0 32px 80px rgba(0,0,0,0.65)',
      }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'26px' }}>
          <div style={{ display:'inline-flex',alignItems:'center',justifyContent:'center',width:'58px',height:'58px',borderRadius:'16px',marginBottom:'13px',background:'linear-gradient(135deg,#4f46e5,#6366f1)',boxShadow:'0 8px 28px rgba(79,70,229,0.45)' }}>
            <FaShieldAlt style={{ color:'#fff', fontSize:'23px' }}/>
          </div>
          <h1 style={{ margin:0, color:'#f1f5f9', fontSize:'22px', fontWeight:700, fontFamily:'Outfit,sans-serif', letterSpacing:'-0.3px' }}>EMS Portal</h1>
          <p style={{ margin:'5px 0 0', color:'#64748b', fontSize:'13px', fontFamily:'Outfit,sans-serif' }}>Employee Management System</p>
        </div>

        {/* Mode tabs */}
        <div style={{ display:'flex', gap:'4px', background:'rgba(255,255,255,0.05)', borderRadius:'11px', padding:'4px', marginBottom:'18px' }}>
          <ModeTab id="login"    label={<><FaSignInAlt style={{marginRight:'5px',fontSize:'11px'}}/>Sign In</>}   mode={mode} reset={reset} />
          <ModeTab id="register" label={<><FaUserPlus  style={{marginRight:'5px',fontSize:'11px'}}/>Register</>}  mode={mode} reset={reset} />
        </div>

        {/* Role tabs */}
        <div style={{ display:'flex', gap:'6px', background:'rgba(255,255,255,0.04)', borderRadius:'11px', padding:'4px', marginBottom:'18px' }}>
          <Tab id="admin"    role={role} setRole={setRole} setError={setError} setSuccess={setSuccess}><FaShieldAlt style={{fontSize:'11px'}}/> Admin   </Tab>
          <Tab id="employee" role={role} setRole={setRole} setError={setError} setSuccess={setSuccess}><FaUser      style={{fontSize:'11px'}}/> Employee</Tab>
        </div>

        {/* Role badge */}
        <div style={{ marginBottom:'16px', padding:'9px 13px', borderRadius:'9px', background: isAdmin?'rgba(79,70,229,0.1)':'rgba(8,145,178,0.1)', border:`1px solid ${isAdmin?'rgba(79,70,229,0.22)':'rgba(8,145,178,0.22)'}` }}>
          <p style={{ margin:0, fontSize:'12px', fontFamily:'Outfit,sans-serif', fontWeight:500, color: isAdmin?'#a5b4fc':'#67e8f9' }}>
            {mode==='login'
              ? (isAdmin ? '🛡️ Admin — full employee management access.' : '👤 Employee — view your profile & details.')
              : (isAdmin ? '🛡️ Registering as Admin — full system control.' : '👤 Registering as Employee — profile access.')}
          </p>
        </div>

        {/* Alerts */}
        {error   && <div style={{ marginBottom:'14px',padding:'10px 13px',borderRadius:'9px',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.25)',color:'#fca5a5',fontSize:'13px',fontFamily:'Outfit,sans-serif' }}>⚠️ {error}</div>}
        {success && <div style={{ marginBottom:'14px',padding:'10px 13px',borderRadius:'9px',background:'rgba(5,150,105,0.1)',border:'1px solid rgba(5,150,105,0.25)',color:'#6ee7b7',fontSize:'13px',fontFamily:'Outfit,sans-serif' }}>{success}</div>}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin}>
            <Field label="Username" icon={<FaUser/>} value={lf.username} placeholder="Enter your username" accent={accent}
              onChange={e => setLf(p => ({ ...p, username: e.target.value }))} />
            <Field label="Password" icon={<FaLock/>} type={showPw?'text':'password'} value={lf.password} placeholder="Enter your password" accent={accent}
              onChange={e => setLf(p => ({ ...p, password: e.target.value }))}
              right={<EyeBtn showPw={showPw} setShowPw={setShowPw} />} />
            <SubmitBtn label={`Sign In as ${isAdmin?'Admin':'Employee'}`} busy={busy} isAdmin={isAdmin} accent={accent} />
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister}>
            <Field label="Full Name"        icon={<FaUser/>}     value={rf.name}     placeholder="Your full name"    accent={accent} onChange={e => setRf(p => ({ ...p, name:     e.target.value }))} />
            <Field label="Email"            icon={<FaEnvelope/>} type="email" value={rf.email} placeholder="you@company.com" accent={accent} onChange={e => setRf(p => ({ ...p, email:    e.target.value }))} />
            <Field label="Username"         icon={<FaUser/>}     value={rf.username} placeholder="Choose a username" accent={accent} onChange={e => setRf(p => ({ ...p, username: e.target.value }))} />
            <Field label="Password"         icon={<FaLock/>}     type={showPw?'text':'password'} value={rf.password} placeholder="Min. 6 characters" accent={accent}
              onChange={e => setRf(p => ({ ...p, password: e.target.value }))}
              right={<EyeBtn showPw={showPw} setShowPw={setShowPw} />} />
            <Field label="Confirm Password" icon={<FaLock/>}     type="password" value={rf.confirm} placeholder="Re-enter password" accent={accent}
              onChange={e => setRf(p => ({ ...p, confirm: e.target.value }))} />
            <SubmitBtn label={`Create ${isAdmin?'Admin':'Employee'} Account`} busy={busy} isAdmin={isAdmin} accent={accent} />
          </form>
        )}

        {/* Switch link */}
        <p style={{ textAlign:'center', marginTop:'18px', fontSize:'13px', color:'#64748b', fontFamily:'Outfit,sans-serif' }}>
          {mode==='login'
            ? <>New here?{' '}<button type="button" onClick={()=>reset('register')} style={{ background:'none',border:'none',cursor:'pointer',color:accent,fontWeight:700,fontFamily:'Outfit,sans-serif',fontSize:'13px' }}>Create an account →</button></>
            : <>Have an account?{' '}<button type="button" onClick={()=>reset('login')} style={{ background:'none',border:'none',cursor:'pointer',color:accent,fontWeight:700,fontFamily:'Outfit,sans-serif',fontSize:'13px' }}>Sign in →</button></>}
        </p>
      </div>
    </div>
  );
}