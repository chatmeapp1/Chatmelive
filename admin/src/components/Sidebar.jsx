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

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-darkCard border-r border-gray-700 p-6 h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold mb-8 text-primary">ChatmeLive</h1>
      <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-4">Admin Panel</h2>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              location.pathname === item.path
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
