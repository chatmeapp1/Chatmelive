import { useEffect, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { mallAPI } from '../service/api';
import { Plus, Trash2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import FormModal from '../components/FormModal';

export default function Mall() {
  const { mall, loading, fetchMall, deleteMallItem } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: null,
  });

  useEffect(() => {
    fetchMall();
  }, []);

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      if (formData.image) {
        const uploadRes = await mallAPI.upload(formData.image);
        imageUrl = uploadRes.data.imageUrl;
      }

      await mallAPI.create({
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        image: imageUrl,
      });

      fetchMall();
      setFormData({ name: '', price: '', description: '', image: null });
      setIsModalOpen(false);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mall Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-green-600 px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} /> Add Item
        </button>
      </div>

      <FormModal
        title="Add Mall Item"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Item Name"
            value={formData. name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ... formData, description: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 h-20 resize-none"
          />
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
            Add Item
          </button>
        </form>
      </FormModal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mall. map((item) => (
          <div key={item.id} className="bg-darkCard rounded-lg p-4 border border-gray-700">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}
            <h3 className="font-bold">{item.name}</h3>
            <p className="text-gray-400 text-sm mt-1">{item.description}</p>
            <p className="text-yellow-400 font-bold text-sm mt-2">{item.price} coins</p>
            <button
              onClick={() => deleteMallItem(item.id)}
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