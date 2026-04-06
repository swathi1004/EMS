import { useEffect, useState } from 'react';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  department: '',
  salary: '',
  phone: ''
};

function EmployeeModal({ open, onClose, onSubmit, editing, employee }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setForm({ ...employee, username: employee.username || '', password: '' });
    } else {
      setForm(initialForm);
    }
    setErrors({});
  }, [employee, open]);

  if (!open) return null;

  const departments = ['Engineering', 'HR', 'Finance', 'Sales', 'Operations', 'Marketing'];

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is mandatory';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is mandatory';
    if (!form.email.trim()) newErrors.email = 'Email is mandatory';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Email looks wrong';
    if (!form.username.trim()) newErrors.username = 'Username is mandatory';
    if (form.username.trim() && form.username.trim().length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!editing && !form.password) newErrors.password = 'Password is mandatory';
    if (form.password && form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!form.department.trim()) {
      newErrors.department = 'Department is required';
    }
    if (!form.salary || Number(form.salary) < 0) newErrors.salary = 'Salary must be a positive number';
    if (!form.phone.trim()) newErrors.phone = 'Phone is mandatory';
    if (form.phone && !/^\+?[0-9 \-()]{5,20}$/.test(form.phone)) newErrors.phone = 'Invalid phone format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSubmit({
      ...form,
      salary: Number(form.salary)
    });
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{editing ? 'Edit Employee' : 'Add New Employee'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-lg">✕</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {[
            { key: 'firstName', label: 'First Name' },
            { key: 'lastName', label: 'Last Name' },
            { key: 'email', label: 'Email' },
            { key: 'username', label: 'Username' },
            { key: 'password', label: 'Password' },
            { key: 'department', label: 'Department' },
            { key: 'salary', label: 'Salary' },
            { key: 'phone', label: 'Phone' }
          ].map((field) => (
            <label key={field.key} className="block text-sm">
              <span className="text-slate-700">{field.label}</span>
              {field.key === 'department' ? (
                <select value={form.department} onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 focus:border-brand-500 focus:ring-brand-100 focus:outline-none">
                  <option value="">Choose department</option>
                  {departments.map((dep) => <option key={dep} value={dep}>{dep}</option>)}
                </select>
              ) : (
                <input
                  value={form[field.key] || ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  type={field.key === 'salary' ? 'number' : field.key === 'password' ? 'password' : 'text'}
                  className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 focus:border-brand-500 focus:ring-brand-100 focus:outline-none"
                />
              )}
              {errors[field.key] && <p className="text-xs text-rose-600 mt-1">{errors[field.key]}</p>}
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-100">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700">{editing ? 'Update' : 'Add'} Employee</button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeModal;
