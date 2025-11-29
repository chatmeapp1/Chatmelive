import { useEffect, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { Ban, Shield } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Hosts() {
  const { agencies, hosts, loading, fetchAgencies, fetchHosts, approveHost } = useAdminStore();
  const [selectedAgency, setSelectedAgency] = useState('');

  useEffect(() => {
    fetchAgencies();
    fetchHosts();
  }, []);

  const handleAgencyChange = (agencyId) => {
    setSelectedAgency(agencyId);
    if (agencyId) {
      fetchHosts(agencyId);
    } else {
      fetchHosts();
    }
  };

  const filteredHosts = selectedAgency
    ? hosts.filter((h) => h.agencyId === selectedAgency)
    : hosts;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Hosts Management</h1>

      <div className="bg-darkCard rounded-lg p-4 border border-gray-700">
        <label className="block text-sm mb-2">Filter by Agency:</label>
        <select
          value={selectedAgency}
          onChange={(e) => handleAgencyChange(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
        >
          <option value="">All Agencies</option>
          {agencies.map((agency) => (
            <option key={agency.id} value={agency.id}>
              {agency.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-darkCard rounded-lg border border-gray-700">
        <table className="w-full">
          <thead className="border-b border-gray-700">
            <tr className="bg-gray-700">
              <th className="px-6 py-3 text-left">Host Name</th>
              <th className="px-6 py-3 text-left">Agency ID</th>
              <th className="px-6 py-3 text-left">Agency</th>
              <th className="px-6 py-3 text-left">Lives</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredHosts.map((host) => (
              <tr key={host.id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="px-6 py-3">{host.username}</td>
                <td className="px-6 py-3 text-gray-300 font-mono text-sm">{host.agency_id || 'N/A'}</td>
                <td className="px-6 py-3 text-gray-400">{host.agency_name || 'N/A'}</td>
                <td className="px-6 py-3">{host.live_count || 0}</td>
                <td className="px-6 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    host.status === 'approved' ? 'bg-green-600/20 text-green-400' :
                    host.status === 'rejected' ? 'bg-red-600/20 text-red-400' :
                    'bg-yellow-600/20 text-yellow-400'
                  }`}>
                    {host.status?.charAt(0).toUpperCase() + host.status?.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-3">
                  {host.status === 'pending' && (
                    <button
                      onClick={() => approveHost(host.id)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs transition"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}