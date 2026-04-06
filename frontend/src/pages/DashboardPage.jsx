import { FaUsers, FaBuilding, FaUserCheck, FaChartLine, FaArrowRight } from 'react-icons/fa';

export default function DashboardPage({ stats, onNav }) {
  const name = localStorage.getItem('ems-name') || 'Admin';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const cards = [
    { icon:<FaUsers/>,     label:'Total Employees', value: stats.totalEmployees,    color:'#4f46e5', bg:'rgba(79,70,229,0.08)',  desc:'Registered in system' },
    { icon:<FaBuilding/>,  label:'Departments',      value: stats.departments || 0,  color:'#0891b2', bg:'rgba(8,145,178,0.08)', desc:'Active teams' },
    { icon:<FaUserCheck/>, label:'Active Staff',     value: stats.activeStaff || 0,    color:'#059669', bg:'rgba(5,150,105,0.08)', desc:'Currently active' },
    { icon:<FaChartLine/>, label:'Avg. Salary',      value: stats.totalEmployees > 0 ? `₹${Math.round((stats.avgSalary||72000)).toLocaleString('en-IN')}` : '—', color:'#d97706', bg:'rgba(217,119,6,0.08)', desc:'Across departments' },
  ];

  const quickActions = [
    { label:'Add Employee',    desc:'Register a new team member',     icon:'➕', action:'employees', color:'#4f46e5' },
    { label:'View All Employees', desc:'Browse and manage your team', icon:'👥', action:'employees', color:'#0891b2' },
    { label:'Search & Filter',   desc:'Find employees quickly',       icon:'🔍', action:'employees', color:'#059669' },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        .stat-card { transition:all 0.2s; }
        .stat-card:hover { transform:translateY(-3px); box-shadow:0 10px 28px rgba(0,0,0,0.1) !important; }
        .qa-card { transition:all 0.2s; cursor:pointer; }
        .qa-card:hover { transform:translateY(-2px); box-shadow:0 8px 22px rgba(0,0,0,0.08) !important; }
      `}</style>

      {/* Welcome */}
      <div style={{ background:'linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)', borderRadius:'18px', padding:'28px 32px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute',top:'-30px',right:'-20px',width:'180px',height:'180px',borderRadius:'50%',background:'rgba(99,102,241,0.12)',pointerEvents:'none' }}/>
        <div style={{ position:'absolute',bottom:'-40px',right:'100px',width:'120px',height:'120px',borderRadius:'50%',background:'rgba(99,102,241,0.08)',pointerEvents:'none' }}/>
        <div style={{ position:'relative' }}>
          <p style={{ margin:'0 0 4px', fontFamily:'Outfit,sans-serif', fontSize:'14px', color:'#a5b4fc', fontWeight:500 }}>{greeting}, 👋</p>
          <h1 style={{ margin:'0 0 6px', fontFamily:'Outfit,sans-serif', fontSize:'26px', fontWeight:700, color:'#f1f5f9', letterSpacing:'-0.3px' }}>{name}</h1>
          <p style={{ margin:0, fontFamily:'Outfit,sans-serif', fontSize:'14px', color:'#64748b' }}>Here's what's happening in your organization today.</p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'16px' }}>
        {cards.map((c,i) => (
          <div key={i} className="stat-card" style={{ background:'#fff', borderRadius:'16px', padding:'22px', border:'1px solid #e2e8f0', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', display:'flex', alignItems:'flex-start', gap:'16px' }}>
            <div style={{ width:'46px', height:'46px', borderRadius:'13px', background:c.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'19px', color:c.color, flexShrink:0 }}>{c.icon}</div>
            <div>
              <p style={{ margin:0, fontFamily:'Outfit,sans-serif', fontSize:'11px', color:'#94a3b8', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>{c.label}</p>
              <p style={{ margin:'4px 0 2px', fontFamily:'Outfit,sans-serif', fontSize:'26px', fontWeight:700, color:'#0f172a', lineHeight:1 }}>{c.value}</p>
              <p style={{ margin:0, fontFamily:'Outfit,sans-serif', fontSize:'12px', color:'#94a3b8' }}>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h3 style={{ margin:'0 0 14px', fontFamily:'Outfit,sans-serif', fontSize:'15px', fontWeight:700, color:'#0f172a' }}>Quick Actions</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'14px' }}>
          {quickActions.map((a,i) => (
            <div key={i} className="qa-card" onClick={() => onNav && onNav(a.action)}
              style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:'14px', padding:'18px 20px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)', display:'flex', flexDirection:'column', gap:'6px' }}>
              <div style={{ fontSize:'24px' }}>{a.icon}</div>
              <div style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:'14px', color:'#0f172a' }}>{a.label}</div>
              <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'12px', color:'#94a3b8' }}>{a.desc}</div>
              <div style={{ display:'flex', alignItems:'center', gap:'4px', marginTop:'4px', color:a.color, fontSize:'12px', fontWeight:600, fontFamily:'Outfit,sans-serif' }}>
                Go <FaArrowRight style={{ fontSize:'10px' }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
