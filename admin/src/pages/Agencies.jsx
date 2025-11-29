import { useEffect, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { Plus, Trash2, Edit } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import FormModal from '../components/FormModal';

export default function Agencies() {
  const { agencies, loading, fetchAgencies, approveAgency, rejectAgency } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchAgencies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addAgency(formData);
    setFormData({ name: '', description: '' });
    setIsModalOpen(false);
  };

  if (loading) return <LoadingSpinner />;

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
            value={formData. name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400"
            required
          />
          <textarea
            placeholder="Description"
            value={formData. description}
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
              <th className="px-6 py-3 text-left">Agency Name</th>
              <th className="px-6 py-3 text-left">Contact</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Hosts</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {agencies.map((agency) => (
              <tr key={agency.id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="px-6 py-3 font-medium">{agency.name}</td>
                <td className="px-6 py-3 text-gray-400">{agency.phone}</td>
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
                  {agency.status === 'pending' && (
                    <div className="flex gap-2">
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
                    </div>
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