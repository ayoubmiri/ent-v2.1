import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useNavigate } from 'react-router-dom';

const EnseignantProfile = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call to fetch teacher data
    const fetchTeacherData = async () => {
      try {
        // Mock data - replace with actual API call
        const mockTeacher = {
          id: 'ENS78901',
          nom: 'Benali',
          prenom: 'Fatima',
          email: 'fatima.benali@estsale.ma',
          telephone: '+212 6 98 76 54 32',
          specialite: 'Informatique',
          grade: 'Professeur',
          dateEmbauche: '2015-09-01',
          photo: '/assets/images/teacher-avatar.jpg',
          coursEnseignes: [
            { module: 'Algorithmique', filiere: 'GL', niveau: '1ère année' },
            { module: 'Base de données', filiere: 'GL', niveau: '2ème année' },
            // More courses...
          ],
          disponibilites: [
            { jour: 'Lundi', heure: '14:00-16:00' },
            { jour: 'Mercredi', heure: '10:00-12:00' },
            // More availability...
          ]
        };
        setTeacher(mockTeacher);
        setFormData(mockTeacher);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call to update teacher data
    setTeacher(formData);
    setEditing(false);
    // In a real app, you would call your API here
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-est-blue"></div>
      </div>
    );
  }

  return (
    <>
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-est-blue">Profil Enseignant</h1>
          {/* <button 
            onClick={() => navigate(-1)}
            className="text-est-blue hover:underline"
          >
            Retour
          </button> */}
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-md">
            <div className="text-center mb-6">
              <img 
                src={teacher.photo} 
                alt={`${teacher.prenom} ${teacher.nom}`} 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-xl font-semibold">{teacher.prenom} {teacher.nom}</h2>
              <p className="text-gray-600">{teacher.grade}</p>
              <p className="text-sm text-gray-500">{teacher.specialite}</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => setEditing(!editing)}
                className="w-full bg-est-blue text-white py-2 px-4 rounded-md hover:bg-blue-900 transition"
              >
                {editing ? 'Annuler' : 'Modifier le profil'}
              </button>
              <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition">
                Changer le mot de passe
              </button>
              <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition">
                Documents administratifs
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {editing ? (
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-6">
                <h2 className="text-xl font-semibold text-est-blue mb-4">Modifier le profil</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-1">Nom</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Prénom</label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-1">Spécialité</label>
                    <input
                      type="text"
                      name="specialite"
                      value={formData.specialite}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Grade</label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue"
                    >
                      <option value="Professeur">Professeur</option>
                      <option value="Maître de conférences">Maître de conférences</option>
                      <option value="Assistant">Assistant</option>
                      <option value="Vacataire">Vacataire</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Date d'embauche</label>
                  <input
                    type="date"
                    name="dateEmbauche"
                    value={formData.dateEmbauche}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-est-blue text-white py-2 px-6 rounded-md hover:bg-blue-900 transition"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Personal Info */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-semibold text-est-blue mb-4">Informations personnelles</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500">Nom complet</p>
                      <p className="font-medium">{teacher.prenom} {teacher.nom}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">ID enseignant</p>
                      <p className="font-medium">{teacher.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">{teacher.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Téléphone</p>
                      <p className="font-medium">{teacher.telephone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Spécialité</p>
                      <p className="font-medium">{teacher.specialite}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Grade</p>
                      <p className="font-medium">{teacher.grade}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date d'embauche</p>
                      <p className="font-medium">{new Date(teacher.dateEmbauche).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </div>

                {/* Courses Taught */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-semibold text-est-blue mb-4">Cours enseignés</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filière</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {teacher.coursEnseignes.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{item.module}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.filiere}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.niveau}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Availability */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-semibold text-est-blue mb-4">Disponibilités</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jour</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {teacher.disponibilites.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{item.jour}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.heure}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

    </>
  );
};

export default EnseignantProfile;