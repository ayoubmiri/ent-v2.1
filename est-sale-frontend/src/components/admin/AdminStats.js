import React, { useState, useEffect } from 'react';
import { fetchStats, updateStats } from '../../services/api';

const AdminStats = () => {
  const [stats, setStats] = useState({
    placementRate: '',
    partners: '',
    students: '',
    teachers: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetchStats();
        setStats(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStats(stats);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStats(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Gestion des statistiques</h2>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Statistiques mises à jour avec succès!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Taux d'insertion (%)</label>
            <input
              type="text"
              name="placementRate"
              value={stats.placementRate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Partenaires industriels</label>
            <input
              type="text"
              name="partners"
              value={stats.partners}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Nombre d'étudiants</label>
            <input
              type="text"
              name="students"
              value={stats.students}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Enseignants experts</label>
            <input
              type="text"
              name="teachers"
              value={stats.teachers}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        </div>
        <button type="submit" className="bg-est-blue text-white px-4 py-2 rounded">
          Mettre à jour
        </button>
      </form>
    </div>
  );
};

export default AdminStats;
