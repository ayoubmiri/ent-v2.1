import React, { useState, useEffect } from 'react';
import { fetchTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../services/api';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    quote: '',
    rating: 5
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const response = await fetchTestimonials();
        setTestimonials(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTestimonial(editingId, formData);
      } else {
        await createTestimonial(formData);
      }
      const response = await fetchTestimonials();
      setTestimonials(response.data);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (testimonial) => {
    setFormData({
      name: testimonial.name,
      position: testimonial.position,
      quote: testimonial.quote,
      rating: testimonial.rating
    });
    setEditingId(testimonial.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTestimonial(id);
      setTestimonials(testimonials.filter(testimonial => testimonial.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      quote: '',
      rating: 5
    });
    setEditingId(null);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gestion des témoignages</h2>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Position</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Note (1-5)</label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border rounded"
              required
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Témoignage</label>
          <textarea
            value={formData.quote}
            onChange={(e) => setFormData({...formData, quote: e.target.value})}
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
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="border p-4 rounded-lg">
            <h3 className="font-semibold">{testimonial.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{testimonial.position}</p>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => handleEdit(testimonial)}
                className="text-est-blue hover:underline"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(testimonial.id)}
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

export default AdminTestimonials;