import { useEffect, useMemo, useState } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaSortUp, FaSortDown, FaSort } from 'react-icons/fa';

/* ── Seed data (used when backend is not running) ── */
const API_URL = 'http://localhost:8080/api/employees';

const getUsers = () => {
  try { return JSON.parse(localStorage.getItem('ems-users') || '[]'); } catch { return []; }
};
const saveUsers = (users) => localStorage.setItem('ems-users', JSON.stringify(users));

const createEmployeeUser = ({ username, password, email, firstName, lastName }) => {
  const users = getUsers();
  if (users.find(u => u.username === username)) throw new Error('Username already exists');
  if (users.find(u => u.email === email)) throw new Error('Email already registered');
  const newUser = { username, password, email, name: `${firstName} ${lastName}`.trim(), role: 'employee' };
  saveUsers([...users, newUser]);
  return newUser;
};

const SEED = [
  { id:1, firstName:'Alice',  lastName:'Beck',    email:'alice.beck@example.com',   department:'Engineering', salary:97000, phone:'+1234567890' },
  { id:2, firstName:'Bob',    lastName:'Curtis',  email:'bob.curtis@example.com',   department:'Sales',       salary:81000, phone:'+1234567891' },
  { id:3, firstName:'Carol',  lastName:'Davis',   email:'carol.davis@example.com',  department:'HR',          salary:68000, phone:'+1234567892' },
  { id:4, firstName:'Daniel', lastName:'Edwards', email:'daniel.edwards@example.com',department:'Finance',    salary:87000, phone:'+1234567893' },
];

const DEPTS = ['Engineering','HR','Finance','Sales','Operations','Marketing'];

/* ── Modal ── */
function Modal({ open, onClose, onSubmit, editing, employee }) {
  const blank = { firstName:'', lastName:'', email:'', username:'', password:'', department:'', salary:'', phone:'' };
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(employee ? { ...employee, username: employee.username || '', password: '', salary: String(employee.salary) } : blank);
    setErrors({});
  }, [open, employee]);

  if (!open) return null;

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const err = {};
    if (!form.firstName.trim())  err.firstName  = 'Required';
    if (!form.lastName.trim())   err.lastName   = 'Required';
    if (!/\S+@\S+\.\S+/.test(form.email)) err.email = 'Valid email required';
    if (!form.username.trim())   err.username = 'Required';
    if (form.username.trim().length > 0 && form.username.trim().length < 3) err.username = 'Minimum 3 characters';
    if (!editing && !form.password) err.password = 'Password is required';
    if (form.password && form.password.length < 6) err.password = 'Minimum 6 characters';
    if (!form.department)        err.department = 'Required';
    if (!form.salary || isNaN(Number(form.salary)) || Number(form.salary) < 0) err.salary = 'Valid salary required';
    if (!form.phone.trim())      err.phone      = 'Required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSubmit({ ...form, salary: Number(form.salary) });
  };

  const inp = (key, label, type='text', extra={}) => (
    <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
      <span style={{ fontSize:'12px', fontWeight:600, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.4px', fontFamily:'Outfit,sans-serif' }}>{label}</span>
      <input
        type={type}
        value={form[key] || ''}
        onChange={set(key)}
        {...extra}
        style={{ padding:'10px 12px', border:`1px solid ${errors[key]?'#f87171':'#e2e8f0'}`, borderRadius:'9px', fontSize:'14px', fontFamily:'Outfit,sans-serif', outline:'none', background:'#f8fafc', color:'#0f172a', width:'100%', boxSizing:'border-box' }}
        onFocus={e=>e.target.style.borderColor='#6366f1'}
        onBlur={e=>e.target.style.borderColor=errors[key]?'#f87171':'#e2e8f0'}
      />
      {errors[key] && <span style={{ fontSize:'11px', color:'#ef4444', fontFamily:'Outfit,sans-serif' }}>{errors[key]}</span>}
    </div>
  );

  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(15,23,42,0.55)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}>
      <div style={{ background:'#fff', borderRadius:'18px', width:'100%', maxWidth:'520px', boxShadow:'0 30px 70px rgba(0,0,0,0.2)', overflow:'hidden' }}>
        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(135deg,#0f172a,#1e1b4b)' }}>
          <h2 style={{ margin:0, fontSize:'17px', fontWeight:700, fontFamily:'Outfit,sans-serif', color:'#f1f5f9' }}>
            {editing ? '✏️ Edit Employee' : '➕ Add New Employee'}
          </h2>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'#94a3b8', cursor:'pointer', width:'30px', height:'30px', borderRadius:'8px', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding:'24px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
          {inp('firstName', 'First Name')}
          {inp('lastName',  'Last Name')}
          {inp('email', 'Email', 'email')}
          {inp('username', 'Username')}
          {inp('password', 'Password', 'password')}
          <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
            <span style={{ fontSize:'12px', fontWeight:600, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.4px', fontFamily:'Outfit,sans-serif' }}>Department</span>
            <select value={form.department || ''} onChange={set('department')}
              style={{ padding:'10px 12px', border:`1px solid ${errors.department?'#f87171':'#e2e8f0'}`, borderRadius:'9px', fontSize:'14px', fontFamily:'Outfit,sans-serif', outline:'none', background:'#f8fafc', color:'#0f172a', width:'100%', boxSizing:'border-box' }}>
              <option value="">Select department</option>
              {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.department && <span style={{ fontSize:'11px', color:'#ef4444', fontFamily:'Outfit,sans-serif' }}>{errors.department}</span>}
          </div>
          {inp('salary', 'Salary (₹)', 'number')}
          {inp('phone',  'Phone')}
        </div>

        {/* Footer */}
        <div style={{ padding:'16px 24px', borderTop:'1px solid #f1f5f9', display:'flex', justifyContent:'flex-end', gap:'10px', background:'#f8fafc' }}>
          <button onClick={onClose} style={{ padding:'10px 20px', border:'1px solid #e2e8f0', borderRadius:'9px', background:'#fff', color:'#64748b', fontFamily:'Outfit,sans-serif', fontWeight:600, fontSize:'14px', cursor:'pointer' }}>
            Cancel
          </button>
          <button onClick={handleSave} style={{ padding:'10px 24px', border:'none', borderRadius:'9px', background:'linear-gradient(135deg,#4f46e5,#6366f1)', color:'#fff', fontFamily:'Outfit,sans-serif', fontWeight:600, fontSize:'14px', cursor:'pointer', boxShadow:'0 4px 12px rgba(79,70,229,0.35)' }}>
            {editing ? 'Update Employee' : 'Add Employee'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Confirm Delete Dialog ── */
function ConfirmDelete({ emp, onCancel, onConfirm }) {
  if (!emp) return null;
  return (
    <div style={{ position:'fixed', inset:0, zIndex:110, background:'rgba(15,23,42,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}>
      <div style={{ background:'#fff', borderRadius:'16px', padding:'28px', maxWidth:'380px', width:'100%', textAlign:'center', boxShadow:'0 20px 50px rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize:'40px', marginBottom:'12px' }}>🗑️</div>
        <h3 style={{ margin:'0 0 8px', fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:'17px', color:'#0f172a' }}>Delete Employee?</h3>
        <p style={{ margin:'0 0 22px', fontFamily:'Outfit,sans-serif', fontSize:'14px', color:'#64748b' }}>
          Are you sure you want to delete <strong>{emp.firstName} {emp.lastName}</strong>? This cannot be undone.
        </p>
        <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
          <button onClick={onCancel} style={{ padding:'10px 22px', border:'1px solid #e2e8f0', borderRadius:'9px', background:'#fff', fontFamily:'Outfit,sans-serif', fontWeight:600, fontSize:'14px', cursor:'pointer', color:'#64748b' }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding:'10px 22px', border:'none', borderRadius:'9px', background:'#ef4444', color:'#fff', fontFamily:'Outfit,sans-serif', fontWeight:600, fontSize:'14px', cursor:'pointer' }}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main EmployeePage ── */
export default function EmployeePage({ setToast, setStats }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]       = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [sortBy, setSortBy]       = useState('firstName');
  const [direction, setDirection] = useState('asc');
  const [openModal, setOpenModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Failed to load employees: ${response.status}`);
      const result = await response.json();
      setEmployees(result.data || []);
    } catch (error) {
      console.error('Employee fetch failed', error);
      setToast('error', 'Load error', 'Could not load employees from backend. Showing sample data.');
      setEmployees(SEED);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // keep stats in sync
  useEffect(() => {
    const updatedStats = {
      totalEmployees: employees.length,
      departments: new Set(employees.map(e=>e.department)).size,
      activeStaff: employees.length,
    };
    localStorage.setItem('ems-employees', JSON.stringify(employees));
    setStats(updatedStats);
  }, [employees]);

  const depts = useMemo(() => ['all', ...Array.from(new Set(employees.map(e=>e.department)))], [employees]);

  const filtered = useMemo(() => {
    let list = [...employees];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e => `${e.firstName} ${e.lastName} ${e.email} ${e.department}`.toLowerCase().includes(q));
    }
    if (filterDept !== 'all') list = list.filter(e => e.department === filterDept);
    list.sort((a,b) => {
      const va = sortBy === 'salary' ? Number(a[sortBy]) : String(a[sortBy]||'').toLowerCase();
      const vb = sortBy === 'salary' ? Number(b[sortBy]) : String(b[sortBy]||'').toLowerCase();
      return direction === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return list;
  }, [employees, search, filterDept, sortBy, direction]);

  const handleSort = (field) => {
    if (sortBy === field) setDirection(d => d==='asc'?'desc':'asc');
    else { setSortBy(field); setDirection('asc'); }
  };

  const handleSubmit = async (payload) => {
    try {
      if (editingEmp) {
        const response = await fetch(`${API_URL}/${editingEmp.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`Update failed: ${response.status}`);
        const result = await response.json();
        const updatedEmployee = result.data;
        setEmployees(employees.map(e => e.id === editingEmp.id ? updatedEmployee : e));
        setToast('success','Updated','Employee updated successfully.');
      } else {
        const users = getUsers();
        if (users.some(u => u.username === payload.username)) {
          setToast('error','Username exists','This username is already taken.');
          return;
        }
        if (users.some(u => u.email === payload.email)) {
          setToast('error','Email exists','This email is already registered.');
          return;
        }

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`Create failed: ${response.status}`);
        const result = await response.json();
        const createdEmployee = result.data;

        saveUsers([...users, {
          username: payload.username,
          password: payload.password,
          email: payload.email,
          name: `${payload.firstName} ${payload.lastName}`.trim(),
          role: 'employee'
        }]);

        setEmployees([...employees, createdEmployee]);
        setToast('success','Added',`Employee added. Username: ${payload.username}`);
      }
    } catch (error) {
      console.error('Employee save failed', error);
      setToast('error','Save error','Failed to save employee to backend.');
      return;
    } finally {
      setOpenModal(false);
      setEditingEmp(null);
    }
  };

  const doDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/${deleteTarget.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
      setEmployees(employees.filter(e => e.id !== deleteTarget.id));
      setToast('success','Deleted',`${deleteTarget.firstName} ${deleteTarget.lastName} removed.`);
    } catch (error) {
      console.error('Employee delete failed', error);
      setToast('error','Delete error','Failed to remove employee from backend.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <FaSort style={{ opacity:0.3, marginLeft:'4px' }}/>;
    return direction==='asc' ? <FaSortUp style={{ marginLeft:'4px', color:'#6366f1' }}/> : <FaSortDown style={{ marginLeft:'4px', color:'#6366f1' }}/>;
  };

  const thStyle = (field) => ({
    padding:'12px 16px', fontSize:'11px', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.6px',
    fontFamily:'Outfit,sans-serif', cursor:'pointer', userSelect:'none', whiteSpace:'nowrap',
    display:'flex', alignItems:'center'
  });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        .emp-row:hover { background:#f8f7ff !important; }
        .act-btn:hover { opacity:0.85; transform:scale(1.05); }
      `}</style>

      {/* Page header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 style={{ margin:0, fontFamily:'Outfit,sans-serif', fontSize:'22px', fontWeight:700, color:'#0f172a' }}>Employee Management</h1>
          <p style={{ margin:'3px 0 0', fontFamily:'Outfit,sans-serif', fontSize:'13px', color:'#94a3b8' }}>{filtered.length} employee{filtered.length!==1?'s':''} found</p>
        </div>
        <button onClick={() => { setEditingEmp(null); setOpenModal(true); }}
          style={{ display:'flex', alignItems:'center', gap:'8px', padding:'11px 20px', background:'linear-gradient(135deg,#4f46e5,#6366f1)', color:'#fff', border:'none', borderRadius:'11px', fontFamily:'Outfit,sans-serif', fontWeight:600, fontSize:'14px', cursor:'pointer', boxShadow:'0 4px 14px rgba(79,70,229,0.35)' }}>
          <FaPlus style={{ fontSize:'12px' }}/> Add Employee
        </button>
      </div>

      {/* Filters */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'12px', alignItems:'center' }}>
        <div style={{ position:'relative' }}>
          <FaSearch style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8', fontSize:'13px' }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, email, department…"
            style={{ width:'100%', boxSizing:'border-box', padding:'11px 14px 11px 38px', border:'1px solid #e2e8f0', borderRadius:'10px', fontSize:'14px', fontFamily:'Outfit,sans-serif', outline:'none', background:'#fff', color:'#0f172a' }}
            onFocus={e=>e.target.style.borderColor='#6366f1'} onBlur={e=>e.target.style.borderColor='#e2e8f0'} />
        </div>
        <select value={filterDept} onChange={e=>setFilterDept(e.target.value)}
          style={{ padding:'11px 14px', border:'1px solid #e2e8f0', borderRadius:'10px', fontSize:'14px', fontFamily:'Outfit,sans-serif', outline:'none', background:'#fff', color:'#0f172a', cursor:'pointer' }}>
          {depts.map(d=><option key={d} value={d}>{d==='all'?'All Departments':d}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background:'#fff', borderRadius:'14px', border:'1px solid #e2e8f0', boxShadow:'0 1px 6px rgba(0,0,0,0.04)', overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'700px' }}>
            <thead style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
              <tr>
                {[['firstName','Name'],['email','Email'],['department','Department'],['salary','Salary'],['phone','Phone']].map(([f,l])=>(
                  <th key={f} onClick={()=>handleSort(f)} style={{ padding:'12px 16px', textAlign:'left' }}>
                    <div style={thStyle(f)}>{l}<SortIcon field={f}/></div>
                  </th>
                ))}
                <th style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.6px', fontFamily:'Outfit,sans-serif' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6" style={{ padding:'40px', textAlign:'center', color:'#94a3b8', fontFamily:'Outfit,sans-serif', fontSize:'14px' }}>
                  No employees found. {search && 'Try a different search term.'}
                </td></tr>
              ) : filtered.map(emp => (
                <tr key={emp.id} className="emp-row" style={{ borderTop:'1px solid #f1f5f9', transition:'background 0.15s' }}>
                  <td style={{ padding:'13px 16px', fontFamily:'Outfit,sans-serif', fontSize:'14px', fontWeight:600, color:'#1e293b' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:'linear-gradient(135deg,#4f46e5,#6366f1)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'12px', fontWeight:700, flexShrink:0 }}>
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      {emp.firstName} {emp.lastName}
                    </div>
                  </td>
                  <td style={{ padding:'13px 16px', fontFamily:'Outfit,sans-serif', fontSize:'13px', color:'#64748b' }}>{emp.email}</td>
                  <td style={{ padding:'13px 16px' }}>
                    <span style={{ background:'#f1f5f9', padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontFamily:'Outfit,sans-serif', fontWeight:600, color:'#475569' }}>{emp.department}</span>
                  </td>
                  <td style={{ padding:'13px 16px', fontFamily:'Outfit,sans-serif', fontSize:'13px', color:'#059669', fontWeight:600 }}>
                    ₹{Number(emp.salary).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding:'13px 16px', fontFamily:'Outfit,sans-serif', fontSize:'13px', color:'#64748b' }}>{emp.phone}</td>
                  <td style={{ padding:'13px 16px' }}>
                    <div style={{ display:'flex', gap:'8px' }}>
                      <button className="act-btn" onClick={() => { setEditingEmp(emp); setOpenModal(true); }}
                        style={{ padding:'7px 12px', border:'none', borderRadius:'8px', background:'#fef3c7', color:'#d97706', cursor:'pointer', fontSize:'13px', fontWeight:600, fontFamily:'Outfit,sans-serif', display:'flex', alignItems:'center', gap:'5px', transition:'all 0.15s' }}>
                        <FaEdit style={{ fontSize:'11px' }}/> Edit
                      </button>
                      <button className="act-btn" onClick={() => setDeleteTarget(emp)}
                        style={{ padding:'7px 12px', border:'none', borderRadius:'8px', background:'#fee2e2', color:'#dc2626', cursor:'pointer', fontSize:'13px', fontWeight:600, fontFamily:'Outfit,sans-serif', display:'flex', alignItems:'center', gap:'5px', transition:'all 0.15s' }}>
                        <FaTrash style={{ fontSize:'11px' }}/> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={openModal} onClose={()=>{setOpenModal(false);setEditingEmp(null);}} onSubmit={handleSubmit} editing={Boolean(editingEmp)} employee={editingEmp} />
      <ConfirmDelete emp={deleteTarget} onCancel={()=>setDeleteTarget(null)} onConfirm={doDelete} />
    </div>
  );
}
