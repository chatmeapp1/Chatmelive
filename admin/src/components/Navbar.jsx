import { LogOut, Settings } from 'lucide-react';

export default function Navbar({ setIsAuthenticated }) {
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated && setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <nav className="bg-darkCard border-b border-gray-700 px-6 py-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-700 rounded-lg transition">
          <Settings size={20} />
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </nav>
  );
}