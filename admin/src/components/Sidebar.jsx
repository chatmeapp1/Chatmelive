import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  Radio,
  Gift,
  ShoppingBag,
  Ban,
  Lock,
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Agencies', icon: Building2, path: '/agencies' },
  { label: 'Hosts', icon: Radio, path: '/hosts' },
  { label: 'Users', icon: Users, path: '/users' },
  { label: 'Gifts', icon: Gift, path: '/gifts' },
  { label: 'Mall', icon: ShoppingBag, path: '/mall' },
  { label: 'Bans', icon: Ban, path: '/bans' },
  { label: 'Super Admin', icon: Lock, path: '/super-admin' },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed lg:static w-64 bg-darkCard border-r border-gray-700 p-4 md:p-6 h-screen overflow-y-auto z-40 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-primary">ChatmeLive</h1>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Admin Panel</h2>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition text-sm md:text-base ${
                location.pathname === item.path
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <item.icon size={18} className="md:size-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
