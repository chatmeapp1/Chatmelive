import { LogOut, Settings, Menu } from 'lucide-react';

export default function Navbar({ setIsAuthenticated, sidebarOpen, setSidebarOpen }) {
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated && setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <nav className="bg-darkCard border-b border-gray-700 px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-lg md:text-xl font-semibold">Admin Dashboard</h2>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 hover:bg-gray-700 rounded-lg transition">
          <Settings size={18} className="md:size-5" />
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-sm md:text-base"
        >
          <LogOut size={16} className="md:size-4" />
          <span className="hidden md:inline">Logout</span>
          <span className="md:hidden">Log</span>
        </button>
      </div>
    </nav>
  );
}