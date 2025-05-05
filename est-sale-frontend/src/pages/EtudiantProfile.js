import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useNavigate } from 'react-router-dom';

const EtudiantProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call to fetch student data
    const fetchStudentData = async () => {
      try {
        // Mock data - replace with actual API call
        const mockStudent = {
          id: 'EST12345',
          nom: 'El Amrani',
          prenom: 'Ahmed',
          email: 'ahmed.elamrani@estsale.ma',
          telephone: '+212 6 12 34 56 78',
          filiere: 'Génie Logiciel',
          niveau: '2ème année',
          dateNaissance: '2000-05-15',
          photo: '/assets/images/student-avatar.jpg',
          emploiDuTemps: [
            { jour: 'Lundi', cours: 'Algorithmique', salle: 'B12', heure: '08:30-10:30' },
            { jour: 'Mardi', cours: 'Base de données', salle: 'A07', heure: '10:45-12:45' },
            // More schedule items...
          ],
          notes: [
            { module: 'Algorithmique', note: 16.5, coefficient: 3 },
            { module: 'Base de données', note: 14, coefficient: 2 },
            // More grades...
          ]
        };
        setStudent(mockStudent);
        setFormData(mockStudent);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
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
    // Simulate API call to update student data
    setStudent(formData);
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
          <h1 className="text-2xl md:text-3xl font-bold text-est-blue">Profil Étudiant</h1>
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
                src={student.photo} 
                alt={`${student.prenom} ${student.nom}`} 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-xl font-semibold">{student.prenom} {student.nom}</h2>
              <p className="text-gray-600">{student.filiere}</p>
              <p className="text-sm text-gray-500">{student.niveau}</p>
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
                Mes documents
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

                <div>
                  <label className="block text-gray-700 mb-1">Date de naissance</label>
                  <input
                    type="date"
                    name="dateNaissance"
                    value={formData.dateNaissance}
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
                      <p className="font-medium">{student.prenom} {student.nom}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">ID étudiant</p>
                      <p className="font-medium">{student.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">{student.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Téléphone</p>
                      <p className="font-medium">{student.telephone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date de naissance</p>
                      <p className="font-medium">{new Date(student.dateNaissance).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Filière</p>
                      <p className="font-medium">{student.filiere}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Niveau</p>
                      <p className="font-medium">{student.niveau}</p>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-semibold text-est-blue mb-4">Emploi du temps</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jour</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cours</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salle</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {student.emploiDuTemps.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{item.jour}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.cours}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.salle}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.heure}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Grades */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-xl font-semibold text-est-blue mb-4">Notes</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coefficient</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {student.notes.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{item.module}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.note}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.coefficient}</td>
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

export default EtudiantProfile;