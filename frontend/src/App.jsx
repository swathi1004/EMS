// import { useState } from 'react';
// import { FaBars, FaTimes } from 'react-icons/fa';
// import Sidebar from './components/Sidebar';
// import Toast from './components/Toast';
// import LoginPage from './pages/LoginPage';
// import DashboardPage from './pages/DashboardPage';
// import EmployeePage from './pages/EmployeePage';
// import EmployeeDashboard from './pages/EmployeeDashboard';

// // Always clear stale sessions on app load
// localStorage.removeItem('ems-token');
// localStorage.removeItem('ems-role');
// localStorage.removeItem('ems-username');
// localStorage.removeItem('ems-name');

// export default function App() {
//   const [isLoggedIn, setIsLoggedIn]   = useState(false);
//   const [userRole, setUserRole]       = useState('');
//   const [view, setView]               = useState('dashboard');
//   const [toasts, setToasts]           = useState([]);
//   const [stats, setStats]             = useState({ totalEmployees:0, departments:0 });
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const showToast = (type, title, message) => {
//     const id = Date.now().toString();
//     setToasts(p => [...p, { id, type, title, message }]);
//     setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
//   };

//   const handleLogin = (role) => {
//     setUserRole(role);
//     setIsLoggedIn(true);
//     setView(role === 'admin' ? 'dashboard' : 'my-profile');
//   };

//   const handleNav = (target) => {
//     setSidebarOpen(false);
//     if (target === 'logout') {
//       ['ems-token','ems-role','ems-username','ems-name'].forEach(k => localStorage.removeItem(k));
//       setIsLoggedIn(false);
//       setUserRole('');
//       setView('dashboard');
//       return;
//     }
//     setView(target);
//   };

//   if (!isLoggedIn) return <LoginPage onLogin={handleLogin} />;

//   const renderContent = () => {
//     if (userRole === 'employee') return <EmployeeDashboard />;
//     if (view === 'employees')   return <EmployeePage setToast={showToast} setStats={setStats} />;
//     return <DashboardPage stats={stats} onNav={handleNav} />;
//   };

//   return (
//     <div style={{ minHeight:'100vh', background:'#f1f5f9', display:'flex' }}>
//       <Toast toasts={toasts} removeToast={id => setToasts(p => p.filter(t => t.id !== id))} />

//       {/* Desktop sidebar */}
//       <div style={{ display:'none' }} className="md-sidebar">
//         <Sidebar onNav={handleNav} active={view} role={userRole} />
//       </div>
//       {/* Always show sidebar on desktop via inline block */}
//       <div className="sidebar-desktop">
//         <Sidebar onNav={handleNav} active={view} role={userRole} />
//       </div>

//       <style>{`
//         @media (max-width: 768px) { .sidebar-desktop { display:none !important; } }
//       `}</style>

//       <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
//         {/* Mobile topbar */}
//         <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px', height:'54px', background:'#0f172a', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
//           <button onClick={()=>setSidebarOpen(true)} style={{ background:'none',border:'none',color:'#a5b4fc',cursor:'pointer',fontSize:'18px',padding:'4px',display:'flex',alignItems:'center' }}>
//             <FaBars/>
//           </button>
//           <span style={{ fontFamily:'Outfit,sans-serif',fontWeight:700,fontSize:'15px',color:'#f1f5f9' }}>EMS Portal</span>
//           <span style={{ fontFamily:'Outfit,sans-serif',fontSize:'11px',color:userRole==='admin'?'#a5b4fc':'#67e8f9',background:userRole==='admin'?'rgba(99,102,241,0.15)':'rgba(8,145,178,0.15)',padding:'3px 10px',borderRadius:'20px',fontWeight:600 }}>
//             {userRole==='admin'?'Admin':'Employee'}
//           </span>
//         </header>

//         {/* Mobile sidebar overlay */}
//         {sidebarOpen && (
//           <div style={{ position:'fixed',inset:0,zIndex:50,background:'rgba(0,0,0,0.65)' }} onClick={()=>setSidebarOpen(false)}>
//             <div style={{ position:'fixed',top:0,left:0,height:'100%',width:'220px',zIndex:51 }} onClick={e=>e.stopPropagation()}>
//               <Sidebar onNav={handleNav} active={view} role={userRole}/>
//             </div>
//             <button onClick={()=>setSidebarOpen(false)} style={{ position:'fixed',top:'14px',left:'234px',background:'rgba(255,255,255,0.1)',border:'none',color:'#fff',borderRadius:'8px',padding:'6px 10px',cursor:'pointer',zIndex:52 }}>
//               <FaTimes/>
//             </button>
//           </div>
//         )}

//         <main style={{ flex:1, padding:'24px 28px', overflowY:'auto' }}>
//           {renderContent()}
//         </main>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeePage from './pages/EmployeePage';
import EmployeeDashboard from './pages/EmployeeDashboard';

// Always clear stale sessions on app load
localStorage.removeItem('ems-token');
localStorage.removeItem('ems-role');
localStorage.removeItem('ems-username');
localStorage.removeItem('ems-name');

/* ── Read stats directly from localStorage so dashboard is always in sync ── */
const computeStats = () => {
  try {
    const SEED = [
      { id:1, firstName:'Alice',  lastName:'Beck',    department:'Engineering', salary:97000 },
      { id:2, firstName:'Bob',    lastName:'Curtis',  department:'Sales',       salary:81000 },
      { id:3, firstName:'Carol',  lastName:'Davis',   department:'HR',          salary:68000 },
      { id:4, firstName:'Daniel', lastName:'Edwards', department:'Finance',     salary:87000 },
    ];
    const employees = JSON.parse(localStorage.getItem('ems-employees') || 'null') || SEED;
    const totalEmployees = employees.length;
    const departments    = new Set(employees.map(e => e.department)).size;
    const avgSalary      = totalEmployees > 0
      ? Math.round(employees.reduce((s, e) => s + Number(e.salary), 0) / totalEmployees)
      : 0;
    return { totalEmployees, departments, avgSalary, activeStaff: totalEmployees };
  } catch {
    return { totalEmployees: 0, departments: 0, avgSalary: 0 };
  }
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [userRole, setUserRole]       = useState('');
  const [view, setView]               = useState('dashboard');
  const [toasts, setToasts]           = useState([]);
  const [stats, setStats]             = useState(computeStats);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Re-read stats from localStorage whenever the view changes (e.g. returning to dashboard)
  useEffect(() => {
    setStats(computeStats());
  }, [view]);

  const showToast = (type, title, message) => {
    const id = Date.now().toString();
    setToasts(p => [...p, { id, type, title, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };

  // Called by EmployeePage whenever employees change — keeps stats live while on that page
  const handleStatsUpdate = (newStats) => {
    setStats(s => ({ ...s, ...newStats }));
  };

  const handleLogin = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setView(role === 'admin' ? 'dashboard' : 'my-profile');
  };

  const handleNav = (target) => {
    setSidebarOpen(false);
    if (target === 'logout') {
      ['ems-token','ems-role','ems-username','ems-name'].forEach(k => localStorage.removeItem(k));
      setIsLoggedIn(false);
      setUserRole('');
      setView('dashboard');
      return;
    }
    setView(target);
  };

  if (!isLoggedIn) return <LoginPage onLogin={handleLogin} />;

  const renderContent = () => {
    if (userRole === 'employee') return <EmployeeDashboard />;
    if (view === 'employees')   return <EmployeePage setToast={showToast} setStats={handleStatsUpdate} />;
    return <DashboardPage stats={stats} onNav={handleNav} />;
  };

  return (
    <div style={{ minHeight:'100vh', background:'#f1f5f9', display:'flex' }}>
      <Toast toasts={toasts} removeToast={id => setToasts(p => p.filter(t => t.id !== id))} />

      {/* Desktop sidebar */}
      <div style={{ display:'none' }} className="md-sidebar">
        <Sidebar onNav={handleNav} active={view} role={userRole} />
      </div>
      {/* Always show sidebar on desktop via inline block */}
      <div className="sidebar-desktop">
        <Sidebar onNav={handleNav} active={view} role={userRole} />
      </div>

      <style>{`
        @media (max-width: 768px) { .sidebar-desktop { display:none !important; } }
      `}</style>

      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        {/* Mobile topbar */}
        <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px', height:'54px', background:'#0f172a', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
          <button onClick={()=>setSidebarOpen(true)} style={{ background:'none',border:'none',color:'#a5b4fc',cursor:'pointer',fontSize:'18px',padding:'4px',display:'flex',alignItems:'center' }}>
            <FaBars/>
          </button>
          <span style={{ fontFamily:'Outfit,sans-serif',fontWeight:700,fontSize:'15px',color:'#f1f5f9' }}>EMS Portal</span>
          <span style={{ fontFamily:'Outfit,sans-serif',fontSize:'11px',color:userRole==='admin'?'#a5b4fc':'#67e8f9',background:userRole==='admin'?'rgba(99,102,241,0.15)':'rgba(8,145,178,0.15)',padding:'3px 10px',borderRadius:'20px',fontWeight:600 }}>
            {userRole==='admin'?'Admin':'Employee'}
          </span>
        </header>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div style={{ position:'fixed',inset:0,zIndex:50,background:'rgba(0,0,0,0.65)' }} onClick={()=>setSidebarOpen(false)}>
            <div style={{ position:'fixed',top:0,left:0,height:'100%',width:'220px',zIndex:51 }} onClick={e=>e.stopPropagation()}>
              <Sidebar onNav={handleNav} active={view} role={userRole}/>
            </div>
            <button onClick={()=>setSidebarOpen(false)} style={{ position:'fixed',top:'14px',left:'234px',background:'rgba(255,255,255,0.1)',border:'none',color:'#fff',borderRadius:'8px',padding:'6px 10px',cursor:'pointer',zIndex:52 }}>
              <FaTimes/>
            </button>
          </div>
        )}

        <main style={{ flex:1, padding:'24px 28px', overflowY:'auto' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}