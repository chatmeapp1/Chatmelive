import { useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import { Users, Radio, Gift, ShoppingBag } from 'lucide-react';

export default function Dashboard() {
  const { agencies, hosts, users, gifts, mall, fetchAgencies, fetchHosts, fetchUsers, fetchGifts, fetchMall } = useAdminStore();

  useEffect(() => {
    fetchAgencies();
    fetchHosts();
    fetchUsers();
    fetchGifts();
    fetchMall();
  }, []);

  const stats = [
    { label: 'Agencies', value: agencies.length, icon: ShoppingBag, color: 'bg-blue-600' },
    { label: 'Hosts', value: hosts.length, icon: Radio, color: 'bg-purple-600' },
    { label: 'Users', value: users.length, icon: Users, color: 'bg-green-600' },
    { label: 'Gifts', value: gifts. length, icon: Gift, color: 'bg-yellow-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 mt-2">Welcome to ChatmeLive Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-darkCard rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon size={28} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}