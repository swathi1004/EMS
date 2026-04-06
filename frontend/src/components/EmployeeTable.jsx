import { FaEdit, FaTrash } from 'react-icons/fa';

function EmployeeTable({ employees, onEdit, onDelete, onSort, sortBy, direction }) {
  const arrow = (field) => {
    if (sortBy !== field) return '';
    return direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm bg-white">
      <table className="min-w-full text-left">
        <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3 cursor-pointer" onClick={() => onSort('salary')}>Salary{arrow('salary')}</th>
            <th className="px-4 py-3 cursor-pointer" onClick={() => onSort('firstName')}>First Name{arrow('firstName')}</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr><td colSpan="7" className="px-4 py-5 text-center text-slate-500">No employees found</td></tr>
          ) : employees.map((emp) => (
            <tr key={emp.id} className="border-t hover:bg-brand-50 transition-colors duration-150">
              <td className="px-4 py-3">{emp.firstName} {emp.lastName}</td>
              <td className="px-4 py-3">{emp.email}</td>
              <td className="px-4 py-3">{emp.department}</td>
              <td className="px-4 py-3">{Number(emp.salary).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</td>
              <td className="px-4 py-3">{emp.firstName}</td>
              <td className="px-4 py-3">{emp.phone}</td>
              <td className="px-4 py-3 flex gap-2">
                <button onClick={() => onEdit(emp)} className="px-2 py-1 rounded-md bg-amber-500 text-white hover:bg-amber-600"><FaEdit /></button>
                <button onClick={() => onDelete(emp)} className="px-2 py-1 rounded-md bg-rose-500 text-white hover:bg-rose-600"><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;
