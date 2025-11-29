import { useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';
import { Shield } from 'lucide-react';

export default function Bans() {
  const { users, hosts, fetchUsers, fetchHosts, banUser, unbanUser, banHost, unbanHost } = useAdminStore();

  useEffect(() => {
    fetchUsers();
    fetchHosts();
  }, []);

  const bannedUsers = users.filter((u) => u.banned);
  const bannedHosts = hosts.filter((h) => h.banned);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Ban Management</h1>

      <div>
        <h2 className="text-xl font-bold mb-4">Banned Users ({bannedUsers.length})</h2>
        <div className="bg-darkCard rounded-lg border border-gray-700 overflow-hidden">
          {bannedUsers.length === 0 ? (
            <div className="p-6 text-center text-gray-400">No banned users</div>
          ) : (
            <table className="w-full">
              <thead className="border-b border-gray-700 bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">Username</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {bannedUsers.map((user) => (
                  <tr key={user. id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="px-6 py-3">{user.username}</td>
                    <td className="px-6 py-3 text-gray-400">{user.email}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => unbanUser(user.id)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition"
                      >
                        <Shield size={16} /> Unban
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Banned Hosts ({bannedHosts.length})</h2>
        <div className="bg-darkCard rounded-lg border border-gray-700 overflow-hidden">
          {bannedHosts.length === 0 ? (
            <div className="p-6 text-center text-gray-400">No banned hosts</div>
          ) : (
            <table className="w-full">
              <thead className="border-b border-gray-700 bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">Host Name</th>
                  <th className="px-6 py-3 text-left">Agency</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {bannedHosts.map((host) => (
                  <tr key={host. id} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="px-6 py-3">{host.name}</td>
                    <td className="px-6 py-3 text-gray-400">{host.agencyName}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => unbanHost(host.id)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition"
                      >
                        <Shield size={16} /> Unban
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}