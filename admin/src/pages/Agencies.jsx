import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { Plus, Trash2, Edit, ChevronDown } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import FormModal from '../components/FormModal';

export default function Agencies() {
  const { agencies, loading, fetchAgencies, approveAgency, rejectAgency } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedAgency, setExpandedAgency] = useState(null);
  const [hostApplications, setHostApplications] = useState({});
  const [loadingApps, setLoadingApps] = useState({});
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchAgencies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData({ name: '', description: '' });
    setIsModalOpen(false);
  };

  const fetchHostApplications = async (agencyId) => {
    try {
      setLoadingApps(prev => ({ ...prev, [agencyId]: true }));
      const response = await fetch(`/api/admin/host-applications/${agencyId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      const data = await response.json();
      setHostApplications(prev => ({ ...prev, [agencyId]: data.data || [] }));
    } catch (error) {
      console.error('Error fetching host applications:', error);
    } finally {
      setLoadingApps(prev => ({ ...prev, [agencyId]: false }));
    }
  };

  const handleApproveHost = async (appId, agencyId) => {
    try {
      const response = await fetch(`/api/admin/host-application/${appId}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      const data = await response.json();
      if (data.success) {
        await fetchHostApplications(agencyId);
      }
    } catch (error) {
      console.error('Error approving host:', error);
    }
  };

  const handleRejectHost = async (appId, agencyId) => {
    try {
      const response = await fetch(`/api/admin/host-application/${appId}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      const data = await response.json();
      if (data.success) {
        await fetchHostApplications(agencyId);
      }
    } catch (error) {
      console.error('Error rejecting host:', error);
    }
  };

  const toggleExpanded = async (agencyId) => {
    if (expandedAgency === agencyId) {
      setExpandedAgency(null);
    } else {
      setExpandedAgency(agencyId);
      if (!hostApplications[agencyId]) {
        await fetchHostApplications(agencyId);
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  const agenciesList = Array.isArray(agencies) ? agencies : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Agencies</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-green-600 px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} /> Add Agency
        </button>
      </div>

      <FormModal
        title="Add New Agency"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Agency Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 h-24 resize-none"
          />
          <button
            type="submit"
            className="w-full bg-primary hover:bg-green-600 px-4 py-2 rounded-lg font-semibold transition"
          >
            Add Agency
          </button>
        </form>
      </FormModal>

      <div className="overflow-x-auto bg-darkCard rounded-lg border border-gray-700">
        <table className="w-full">
          <thead className="border-b border-gray-700">
            <tr className="bg-gray-700">
              <th className="px-6 py-3 text-left">Agency ID</th>
              <th className="px-6 py-3 text-left">Agency Name</th>
              <th className="px-6 py-3 text-left">Contact</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Hosts</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {agenciesList.map((agency) => (
              <React.Fragment key={agency.id}>
                <tr className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="px-6 py-3 text-gray-300 font-mono text-sm">{agency.id}</td>
                  <td className="px-6 py-3 font-medium">{agency.family_name || agency.name}</td>
                  <td className="px-6 py-3 text-gray-400">{agency.phone || agency.user_name}</td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      agency.status === 'approved' ? 'bg-green-600/20 text-green-400' :
                      agency.status === 'rejected' ? 'bg-red-600/20 text-red-400' :
                      'bg-yellow-600/20 text-yellow-400'
                    }`}>
                      {agency.status?.charAt(0).toUpperCase() + agency.status?.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-3">{agency.total_hosts || 0}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2 items-center">
                      {agency.status === 'pending' && (
                        <>
                          <button
                            onClick={() => approveAgency(agency.id)}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectAgency(agency.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs transition"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {agency.status === 'approved' && (
                        <button
                          onClick={() => toggleExpanded(agency.id)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition flex items-center gap-1"
                        >
                          <ChevronDown size={14} className={expandedAgency === agency.id ? 'rotate-180' : ''} />
                          Hosts
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedAgency === agency.id && agency.status === 'approved' && (
                  <tr className="bg-gray-800">
                    <td colSpan="6" className="px-6 py-4">
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="font-semibold mb-3">Host Applications</h3>
                        {loadingApps[agency.id] ? (
                          <p className="text-gray-400">Loading...</p>
                        ) : hostApplications[agency.id]?.length > 0 ? (
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {hostApplications[agency.id].map(app => (
                              <div key={app.id} className="bg-gray-600 rounded p-3 flex justify-between items-center">
                                <div className="text-sm">
                                  <p className="font-medium">{app.name} (ID: {app.host_id})</p>
                                  <p className="text-gray-300">{app.user_name || 'User'}</p>
                                  <p className="text-xs text-gray-400">Status: {app.status}</p>
                                </div>
                                {app.status === 'pending' && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleApproveHost(app.id, agency.id)}
                                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs transition"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleRejectHost(app.id, agency.id)}
                                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs transition"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400">No host applications</p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}