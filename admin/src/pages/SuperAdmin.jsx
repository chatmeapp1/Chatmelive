import { useState, useEffect } from 'react';
import { Send, Settings } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../service/api';

export default function SuperAdmin() {
  const [tab, setTab] = useState('transfer'); // transfer or jp-settings
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Transfer Coin State
  const [transferForm, setTransferForm] = useState({ toUserId: '', amount: '', reason: '' });
  
  // JP Settings State
  const [jpSettings, setJpSettings] = useState(null);
  const [showJpForm, setShowJpForm] = useState(false);

  // Verify super admin access on mount
  useEffect(() => {
    verifySuperAdmin();
  }, []);

  const verifySuperAdmin = async () => {
    try {
      const { data } = await api.get('/super-admin/verify');
      if (!data.success) {
        setMessage('❌ Not authorized as super admin');
      }
    } catch (err) {
      setMessage('❌ Super admin access denied');
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/super-admin/transfer-coin', {
        toUserId: parseInt(transferForm.toUserId),
        amount: parseInt(transferForm.amount),
        reason: transferForm.reason
      });
      if (data.success) {
        setMessage(`✅ ${data.message}`);
        setTransferForm({ toUserId: '', amount: '', reason: '' });
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || 'Failed to transfer'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadJPSettings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/super-admin/jp-settings');
      setJpSettings(data.data);
    } catch (err) {
      setMessage('❌ Failed to load JP settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateJPSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/super-admin/jp-settings', jpSettings);
      if (data.success) {
        setMessage('✅ JP settings updated');
        setShowJpForm(false);
      }
    } catch (err) {
      setMessage('❌ Failed to update JP settings');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !jpSettings) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-red-500">Super Admin Panel</h1>
      
      {message && (
        <div className="p-4 rounded-lg bg-gray-700 border border-gray-600">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4">
        <button
          onClick={() => setTab('transfer')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            tab === 'transfer'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <Send className="inline mr-2" size={18} />
          Transfer Coin
        </button>
        <button
          onClick={() => {
            setTab('jp-settings');
            if (!jpSettings) handleLoadJPSettings();
          }}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            tab === 'jp-settings'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <Settings className="inline mr-2" size={18} />
          JP Settings
        </button>
      </div>

      {/* Transfer Coin Tab */}
      {tab === 'transfer' && (
        <div className="bg-darkCard rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Transfer Coin to User</h2>
          <form onSubmit={handleTransferSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2">User ID (6+ digits)</label>
              <input
                type="number"
                placeholder="e.g., 260125"
                value={transferForm.toUserId}
                onChange={(e) => setTransferForm({ ...transferForm, toUserId: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400"
                required
                min="100000"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Coin Amount</label>
              <input
                type="number"
                placeholder="1000"
                value={transferForm.amount}
                onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Reason (Optional)</label>
              <input
                type="text"
                placeholder="e.g., Compensation, Promotion"
                value={transferForm.reason}
                onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Transfer Coin'}
            </button>
          </form>
        </div>
      )}

      {/* JP Settings Tab */}
      {tab === 'jp-settings' && jpSettings && (
        <div className="bg-darkCard rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">JP Jackpot Settings</h2>
          
          {!showJpForm ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">Combo Options</h3>
                <p className="text-gray-300">{jpSettings.comboOptions.join(', ')}</p>
              </div>
              
              <div>
                <h3 className="font-bold mb-2">Cooldown</h3>
                <p className="text-gray-300">{jpSettings.cooldownMinutes} minutes</p>
              </div>
              
              <div>
                <h3 className="font-bold mb-3">JP Levels</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="px-3 py-2 text-left">Level</th>
                        <th className="px-3 py-2 text-left">Chance</th>
                        <th className="px-3 py-2 text-left">Multiplier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jpSettings.jpLevels.map((jp, idx) => (
                        <tr key={idx} className="border-t border-gray-600">
                          <td className="px-3 py-2">{jp.level}</td>
                          <td className="px-3 py-2">{(jp.chance * 100).toFixed(2)}%</td>
                          <td className="px-3 py-2">x{jp.rewardMultiplier}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <button
                onClick={() => setShowJpForm(true)}
                className="w-full bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg font-semibold transition"
              >
                Edit Settings
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateJPSettings} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Combo Options (comma separated)</label>
                <input
                  type="text"
                  value={jpSettings.comboOptions.join(', ')}
                  onChange={(e) => setJpSettings({
                    ...jpSettings,
                    comboOptions: e.target.value.split(',').map(x => parseInt(x.trim()))
                  })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Cooldown (minutes)</label>
                <input
                  type="number"
                  value={jpSettings.cooldownMinutes}
                  onChange={(e) => setJpSettings({
                    ...jpSettings,
                    cooldownMinutes: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowJpForm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
