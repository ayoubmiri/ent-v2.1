import React, { useState, useEffect } from 'react';
import { fetchNews, createNews, updateNews, deleteNews } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: ''
  });
  const [editingId, setEditingId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetchNews();
        setNews(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateNews(editingId, formData);
      } else {
        await createNews(formData);
      }
      const response = await fetchNews();
      setNews(response.data);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      content: item.content,
      image: item.image
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteNews(id);
      setNews(news.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      image: ''
    });
    setEditingId(null);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gestion des actualités</h2>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Titre</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Image URL</label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Contenu</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            className="w-full px-3 py-2 border rounded"
            rows="4"
            required
          />
        </div>
        <div className="flex space-x-2">
          <button type="submit" className="bg-est-blue text-white px-4 py-2 rounded">
            {editingId ? 'Mettre à jour' : 'Ajouter'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">
              Annuler
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {news.map(item => (
          <div key={item.id} className="border p-4 rounded-lg">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{new Date(item.createdAt).toLocaleDateString()}</p>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => handleEdit(item)}
                className="text-est-blue hover:underline"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:underline"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNews;