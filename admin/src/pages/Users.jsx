import { useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import { Ban, Shield } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Users() {
  const { users, loading, fetchUsers, banUser, unbanUser } = useAdminStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Users Management</h1>

      <div className="overflow-x-auto bg-darkCard rounded-lg border border-gray-700">
        <table className="w-full">
          <thead className="border-b border-gray-700">
            <tr className="bg-gray-700">
              <th className="px-6 py-3 text-left">User ID</th>
              <th className="px-6 py-3 text-left">Username</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Coin</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="px-6 py-3 text-gray-300 font-mono text-sm">{user.id}</td>
                <td className="px-6 py-3 font-medium">{user.username}</td>
                <td className="px-6 py-3 text-gray-400">{user.email}</td>
                <td className="px-6 py-3 text-yellow-400 font-bold">{user.coin || 0}</td>
                <td className="px-6 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.is_banned ? 'bg-red-600/20 text-red-400' : 'bg-green-600/20 text-green-400'
                  }`}>
                    {user.is_banned ? 'Banned' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => user.is_banned ? unbanUser(user.id) : banUser(user.id)}
                    className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition ${
                      user.is_banned
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {user.is_banned ? <Shield size={16} /> : <Ban size={16} />}
                    {user.is_banned ? 'Unban' : 'Ban'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}