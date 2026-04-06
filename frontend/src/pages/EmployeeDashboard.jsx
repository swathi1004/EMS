// import { FaUser, FaEnvelope, FaBuilding, FaDollarSign, FaPhone, FaIdBadge } from 'react-icons/fa';

// function EmployeeDashboard() {
//   const name = localStorage.getItem('ems-name') || 'Employee';
//   const username = localStorage.getItem('ems-username') || '';
//   const [firstName, ...rest] = name.split(' ');
//   const lastName = rest.join(' ');
//   const initials = name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);

//   const cards = [
//     { icon: <FaUser />, label: 'Full Name', value: name, color: '#6366f1' },
//     { icon: <FaUser />, label: 'Username', value: username, color: '#0891b2' },
//     { icon: <FaBuilding />, label: 'Department', value: 'Pending Assignment', color: '#7c3aed' },
//     { icon: <FaPhone />, label: 'Phone', value: 'Not provided', color: '#059669' },
//     { icon: <FaDollarSign />, label: 'Salary', value: 'Confidential', color: '#d97706' },
//     { icon: <FaIdBadge />, label: 'Status', value: 'Active', color: '#dc2626' },
//   ];

//   return (
//     <div className="space-y-6">
//       <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
//       .ecard{transition:all 0.2s;} .ecard:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(0,0,0,0.08);}`}</style>

//       <div style={{ background:'linear-gradient(135deg,#0f172a,#1e1b4b)', borderRadius:'16px', padding:'28px 32px', color:'#fff', position:'relative', overflow:'hidden' }}>
//         <div style={{ position:'absolute',top:'-30px',right:'-30px',width:'160px',height:'160px',borderRadius:'50%',background:'rgba(99,102,241,0.15)' }}/>
//         <div style={{ position:'relative', display:'flex', alignItems:'center', gap:'18px' }}>
//           <div style={{ width:'60px',height:'60px',borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',fontWeight:700,fontFamily:'Outfit,sans-serif',flexShrink:0 }}>
//             {initials}
//           </div>
//           <div>
//             <p style={{ margin:0,fontSize:'13px',color:'#a5b4fc',fontFamily:'Outfit,sans-serif' }}>Welcome back,</p>
//             <h2 style={{ margin:'2px 0 8px',fontSize:'22px',fontWeight:700,fontFamily:'Outfit,sans-serif' }}>{name}</h2>
//             <span style={{ background:'rgba(5,150,105,0.2)',borderRadius:'20px',padding:'4px 14px',fontSize:'13px',fontFamily:'Outfit,sans-serif',color:'#6ee7b7' }}>● Active Employee</span>
//           </div>
//         </div>
//       </div>

//       <div>
//         <h3 style={{ fontSize:'15px',fontWeight:600,color:'#374151',marginBottom:'14px',fontFamily:'Outfit,sans-serif' }}>My Profile Information</h3>
//         <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))',gap:'13px' }}>
//           {cards.map((card,i)=>(
//             <div key={i} className="ecard" style={{ background:'#fff',borderRadius:'14px',padding:'18px 20px',border:'1px solid #e2e8f0',display:'flex',alignItems:'center',gap:'15px' }}>
//               <div style={{ width:'42px',height:'42px',borderRadius:'11px',background:`${card.color}15`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'17px',color:card.color,flexShrink:0 }}>{card.icon}</div>
//               <div style={{ overflow:'hidden' }}>
//                 <p style={{ margin:0,fontSize:'11px',color:'#94a3b8',fontFamily:'Outfit,sans-serif',fontWeight:500,textTransform:'uppercase',letterSpacing:'0.5px' }}>{card.label}</p>
//                 <p style={{ margin:'3px 0 0',fontSize:'14px',fontWeight:600,color:'#1e293b',fontFamily:'Outfit,sans-serif',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{card.value}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div style={{ background:'#fefce8',border:'1px solid #fde68a',borderRadius:'12px',padding:'14px 18px',display:'flex',alignItems:'center',gap:'10px' }}>
//         <span style={{ fontSize:'18px' }}>ℹ️</span>
//         <p style={{ margin:0,fontSize:'13px',color:'#92400e',fontFamily:'Outfit,sans-serif' }}>
//           This is a <strong>read-only view</strong>. To update your profile details, contact your HR administrator.
//         </p>
//       </div>
//     </div>
//   );
// }

// export default EmployeeDashboard;


import { FaUser, FaEnvelope, FaBuilding, FaDollarSign, FaPhone, FaIdBadge } from 'react-icons/fa';

function EmployeeDashboard() {
  const name     = localStorage.getItem('ems-name')     || 'Employee';
  const username = localStorage.getItem('ems-username') || '';
  const email    = localStorage.getItem('ems-email')    || '';
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  // Look up the full employee record from the shared employee list
  const getEmployeeRecord = () => {
    try {
      const list = JSON.parse(localStorage.getItem('ems-employees') || '[]');
      // Match by username first (most reliable), fall back to email/name
      return list.find(e => e.username === username)
          || list.find(e => e.email === email)
          || list.find(e => `${e.firstName} ${e.lastName}`.trim() === name)
          || null;
    } catch { return null; }
  };

  const record = getEmployeeRecord();

  const dept   = record?.department || 'Pending Assignment';
  const phone  = record?.phone      || 'Not provided';
  const salary = record?.salary != null && record.salary > 0
    ? `₹${Number(record.salary).toLocaleString('en-IN')}`
    : 'Pending';

  const cards = [
    { icon: <FaUser />,        label: 'Full Name',   value: name,     color: '#6366f1' },
    { icon: <FaUser />,        label: 'Username',    value: username, color: '#0891b2' },
    { icon: <FaBuilding />,    label: 'Department',  value: dept,     color: '#7c3aed' },
    { icon: <FaPhone />,       label: 'Phone',       value: phone,    color: '#059669' },
    { icon: <FaDollarSign />,  label: 'Salary',      value: salary,   color: '#d97706' },
    { icon: <FaIdBadge />,     label: 'Status',      value: 'Active', color: '#dc2626' },
  ];

  return (
    <div className="space-y-6">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
      .ecard{transition:all 0.2s;} .ecard:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(0,0,0,0.08);}`}</style>

      <div style={{ background:'linear-gradient(135deg,#0f172a,#1e1b4b)', borderRadius:'16px', padding:'28px 32px', color:'#fff', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute',top:'-30px',right:'-30px',width:'160px',height:'160px',borderRadius:'50%',background:'rgba(99,102,241,0.15)' }}/>
        <div style={{ position:'relative', display:'flex', alignItems:'center', gap:'18px' }}>
          <div style={{ width:'60px',height:'60px',borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',fontWeight:700,fontFamily:'Outfit,sans-serif',flexShrink:0 }}>
            {initials}
          </div>
          <div>
            <p style={{ margin:0,fontSize:'13px',color:'#a5b4fc',fontFamily:'Outfit,sans-serif' }}>Welcome back,</p>
            <h2 style={{ margin:'2px 0 8px',fontSize:'22px',fontWeight:700,fontFamily:'Outfit,sans-serif' }}>{name}</h2>
            <span style={{ background:'rgba(5,150,105,0.2)',borderRadius:'20px',padding:'4px 14px',fontSize:'13px',fontFamily:'Outfit,sans-serif',color:'#6ee7b7' }}>● Active Employee</span>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize:'15px',fontWeight:600,color:'#374151',marginBottom:'14px',fontFamily:'Outfit,sans-serif' }}>My Profile Information</h3>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))',gap:'13px' }}>
          {cards.map((card,i)=>(
            <div key={i} className="ecard" style={{ background:'#fff',borderRadius:'14px',padding:'18px 20px',border:'1px solid #e2e8f0',display:'flex',alignItems:'center',gap:'15px' }}>
              <div style={{ width:'42px',height:'42px',borderRadius:'11px',background:`${card.color}15`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'17px',color:card.color,flexShrink:0 }}>{card.icon}</div>
              <div style={{ overflow:'hidden' }}>
                <p style={{ margin:0,fontSize:'11px',color:'#94a3b8',fontFamily:'Outfit,sans-serif',fontWeight:500,textTransform:'uppercase',letterSpacing:'0.5px' }}>{card.label}</p>
                <p style={{ margin:'3px 0 0',fontSize:'14px',fontWeight:600,color:'#1e293b',fontFamily:'Outfit,sans-serif',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:'#fefce8',border:'1px solid #fde68a',borderRadius:'12px',padding:'14px 18px',display:'flex',alignItems:'center',gap:'10px' }}>
        <span style={{ fontSize:'18px' }}>ℹ️</span>
        <p style={{ margin:0,fontSize:'13px',color:'#92400e',fontFamily:'Outfit,sans-serif' }}>
          This is a <strong>read-only view</strong>. To update your profile details, contact your HR administrator.
        </p>
      </div>
    </div>
  );
}

export default EmployeeDashboard;