import { useEffect, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { giftsAPI } from '../services/api';
import { Plus, Trash2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import FormModal from '../components/FormModal';

export default function Gifts() {
  const { gifts, loading, fetchGifts, deleteGift } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 's-lucky',
    image: null,
  });

  useEffect(() => {
    fetchGifts();
  }, []);

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      if (formData.image) {
        const uploadRes = await giftsAPI.upload(formData.image);
        imageUrl = uploadRes.data. imageUrl;
      }

      await giftsAPI.create({
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        src: imageUrl,
      });

      fetchGifts();
      setFormData({ name: '', price: '', category: 's-lucky', image: null });
      setIsModalOpen(false);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gift Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-green-600 px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} /> Add Gift
        </button>
      </div>

      <FormModal
        title="Add New Gift"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Gift Name"
            value={formData.name}
            onChange={(e) => setFormData({ ... formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400"
            required
          />
          <input
            type="number"
            placeholder="Price (coins)"
            value={formData. price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400"
            required
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
          >
            <option value="s-lucky">S-Lucky</option>
            <option value="lucky">Lucky</option>
            <option value="luxury">Luxury</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
          />
          <button
            type="submit"
            className="w-full bg-primary hover:bg-green-600 px-4 py-2 rounded-lg font-semibold transition"
          >
            Add Gift
          </button>
        </form>
      </FormModal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {gifts. map((gift) => (
          <div key={gift.id} className="bg-darkCard rounded-lg p-4 border border-gray-700">
            {gift.src && (
              <img
                src={gift.src}
                alt={gift.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="font-bold text-sm">{gift.name}</h3>
            <p className="text-yellow-400 font-bold text-sm mt-1">{gift.price} coins</p>
            <p className="text-gray-400 text-xs mt-1">{gift.category}</p>
            <button
              onClick={() => deleteGift(gift.id)}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded mt-3 transition text-sm"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}