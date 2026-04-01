import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function Admin() {
  const [fooledUsers, setFooledUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/fooled')
      .then(res => res.json())
      .then(data => setFooledUsers(data))
      .catch(err => console.error('Failed to fetch fooled users:', err));
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f6f8] font-sans text-slate-800 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-[#003366] text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Victims List (Fooled Users)
          </h2>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
                <th className="p-3 border-b">ID</th>
                <th className="p-3 border-b">Hall Ticket No</th>
                <th className="p-3 border-b">Semester</th>
                <th className="p-3 border-b">Time Fooled</th>
              </tr>
            </thead>
            <tbody>
              {fooledUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="p-3 border-b text-slate-500">#{u.id}</td>
                  <td className="p-3 border-b font-mono font-bold text-[#003366]">{u.htno}</td>
                  <td className="p-3 border-b">{u.semester}</td>
                  <td className="p-3 border-b text-slate-500">{new Date(u.timestamp).toLocaleString()}</td>
                </tr>
              ))}
              {fooledUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No one has been fooled yet. Share the link!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
