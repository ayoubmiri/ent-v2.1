import React, { useState, useEffect } from 'react';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../../services/api';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    day: '',
    month: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetchEvents();
        setEvents(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateEvent(editingId, formData);
      } else {
        await createEvent(formData);
      }
      const response = await fetchEvents();
      setEvents(response.data);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      day: event.day,
      month: event.month
    });
    setEditingId(event.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      setEvents(events.filter(event => event.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      day: '',
      month: ''
    });
    setEditingId(null);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gestion des événements</h2>
      
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
            <label className="block text-gray-700 mb-2">Lieu</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Jour</label>
            <input
              type="text"
              value={formData.day}
              onChange={(e) => setFormData({...formData, day: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Mois</label>
            <input
              type="text"
              value={formData.month}
              onChange={(e) => setFormData({...formData, month: e.target.value})}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
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
        {events.map(event => (
          <div key={event.id} className="border p-4 rounded-lg">
            <h3 className="font-semibold">{event.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{event.day} {event.month} - {event.location}</p>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => handleEdit(event)}
                className="text-est-blue hover:underline"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(event.id)}
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

export default AdminEvents;