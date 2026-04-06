import { FaChartLine, FaUsers, FaSignOutAlt, FaShieldAlt, FaUser, FaHome } from 'react-icons/fa';

export default function Sidebar({ onNav, active, role }) {
  const isAdmin = role === 'admin';
  const name = localStorage.getItem('ems-name') || (isAdmin ? 'Admin' : 'Employee');
  const username = localStorage.getItem('ems-username') || '';
  const initials = name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);

  const links = isAdmin
    ? [{ id:'dashboard', icon:<FaHome/>,      label:'Dashboard' },
       { id:'employees', icon:<FaUsers/>,     label:'Employees' }]
    : [{ id:'my-profile', icon:<FaUser/>,    label:'My Profile' }];

  return (
    <aside style={{ width:'220px', background:'#0f172a', minHeight:'100vh', display:'flex', flexDirection:'column', flexShrink:0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        .sl { display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;border:none;width:100%;text-align:left;cursor:pointer;font-family:Outfit,sans-serif;font-size:14px;font-weight:500;transition:all 0.18s;background:transparent;color:#94a3b8; }
        .sl:hover { background:rgba(255,255,255,0.07); color:#e2e8f0; }
        .sl.active { background:rgba(99,102,241,0.18); color:#a5b4fc; }
        .sl.active-emp { background:rgba(8,145,178,0.18); color:#67e8f9; }
        .logout-btn { display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;border:none;width:100%;text-align:left;cursor:pointer;font-family:Outfit,sans-serif;font-size:14px;font-weight:500;background:transparent;color:#f87171;transition:all 0.18s; }
        .logout-btn:hover { background:rgba(239,68,68,0.1); }
      `}</style>

      {/* Logo */}
      <div style={{ padding:'18px 16px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'36px',height:'36px',borderRadius:'10px',background:'linear-gradient(135deg,#4f46e5,#6366f1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
            <FaShieldAlt style={{ color:'#fff', fontSize:'15px' }}/>
          </div>
          <div>
            <div style={{ fontFamily:'Outfit,sans-serif',fontWeight:700,fontSize:'15px',color:'#f1f5f9' }}>EMS Portal</div>
            <div style={{ fontFamily:'Outfit,sans-serif',fontSize:'11px',color:isAdmin?'#a5b4fc':'#67e8f9',fontWeight:500 }}>
              {isAdmin?'🛡️ Admin':'👤 Employee'}
            </div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex:1, padding:'10px 8px' }}>
        <div style={{ fontSize:'10px',fontFamily:'Outfit,sans-serif',fontWeight:700,color:'#374151',textTransform:'uppercase',letterSpacing:'1px',padding:'4px 10px 8px' }}>Menu</div>
        {links.map(link => {
          const isActive = active === link.id;
          const cls = isActive ? (isAdmin?'sl active':'sl active-emp') : 'sl';
          return (
            <button key={link.id} className={cls} onClick={() => onNav(link.id)}>
              <span style={{ fontSize:'14px', flexShrink:0 }}>{link.icon}</span>
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* User info + Logout */}
      <div style={{ padding:'10px 8px 14px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',marginBottom:'6px',background:'rgba(255,255,255,0.04)',borderRadius:'10px' }}>
          <div style={{ width:'34px',height:'34px',borderRadius:'50%',background:'linear-gradient(135deg,#4f46e5,#6366f1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:700,color:'#fff',flexShrink:0 }}>
            {initials}
          </div>
          <div style={{ overflow:'hidden' }}>
            <div style={{ fontFamily:'Outfit,sans-serif',fontSize:'13px',fontWeight:600,color:'#e2e8f0',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{name}</div>
            <div style={{ fontFamily:'Outfit,sans-serif',fontSize:'11px',color:'#64748b' }}>{isAdmin?'Administrator':'Employee'}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={() => onNav('logout')}>
          <FaSignOutAlt style={{ fontSize:'14px', flexShrink:0 }}/>
          Logout
        </button>
      </div>
    </aside>
  );
}
