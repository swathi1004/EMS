export default function Toast({ toasts, removeToast }) {
  if (!toasts.length) return null;
  return (
    <div style={{ position:'fixed',right:'16px',top:'16px',zIndex:200,display:'flex',flexDirection:'column',gap:'8px' }}>
      {toasts.map(t => (
        <div key={t.id} style={{ minWidth:'260px',maxWidth:'340px',borderRadius:'12px',padding:'12px 16px',boxShadow:'0 8px 24px rgba(0,0,0,0.15)',background:t.type==='success'?'#059669':'#dc2626',color:'#fff',fontFamily:'Outfit,sans-serif' }}>
          <div style={{ fontWeight:700,fontSize:'14px',marginBottom:'2px' }}>{t.title}</div>
          <div style={{ fontSize:'13px',opacity:0.9 }}>{t.message}</div>
          <button onClick={()=>removeToast(t.id)} style={{ background:'none',border:'none',color:'rgba(255,255,255,0.7)',cursor:'pointer',fontSize:'12px',marginTop:'4px',padding:0,fontFamily:'Outfit,sans-serif' }}>Dismiss</button>
        </div>
      ))}
    </div>
  );
}
