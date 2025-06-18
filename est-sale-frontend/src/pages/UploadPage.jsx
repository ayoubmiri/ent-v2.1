// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { 
//   FaChalkboardTeacher, 
//   FaBook, 
//   FaUsers, 
//   FaQuestionCircle, 
//   FaEnvelope, 
//   FaBell, 
//   FaFileAlt, 
//   FaCalendarAlt,
//   FaChartLine,
//   FaUserEdit,
//   FaTasks,
//   FaClipboardCheck,
//   FaRobot,
//   FaUpload
// } from 'react-icons/fa';

// const UploadPage = () => {
//   const { user } = useAuth();
//   const [file, setFile] = useState(null);
//   const [formData, setFormData] = useState({
//     filiere: '',
//     module: '',
//     element: '',
//     titre: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type !== 'application/pdf') {
//       setError('Please select a PDF file.');
//       setFile(null);
//     } else {
//       setError(null);
//       setFile(selectedFile);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file || !formData.filiere || !formData.module || !formData.element || !formData.titre) {
//       setError('Please fill in all fields and select a PDF file.');
//       return;
//     }

//     if (!user?.token) {
//       setError('Authentication token is missing. Please log in again.');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     const form = new FormData();
//     form.append('file', file);
//     form.append('filiere', formData.filiere);
//     form.append('module', formData.module);
//     form.append('element', formData.element);
//     form.append('titre', formData.titre);

//     try {
//       const response = await fetch('http://localhost:8005/upload/', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//         body: form,
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error('Unauthorized: Invalid or expired token. Please log in again.');
//         }
//         throw new Error(data.detail || 'Failed to upload file.');
//       }

//       setSuccess(`File uploaded successfully to bucket ${data.bucket}!`);
//       setFormData({ filiere: '', module: '', element: '', titre: '' });
//       setFile(null);
//       document.getElementById('fileInput').value = ''; // Reset file input
//     } catch (err) {
//       setError(err.message || 'An unexpected error occurred.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-red-500">Please log in to access this page.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
//       {/* Main Content */}
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <aside className="sidebar w-64 bg-white p-6 shadow-md">
//           <h2 className="text-est-blue text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Enseignement</h2>
//           <ul className="space-y-2">
//             <li>
//               <Link to="/espace-enseignant" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
//                 <FaChalkboardTeacher className="mr-2" /> Mes Cours
//               </Link>
//             </li>
//             <li>
//               <Link to="/upload" className="flex items-center px-3 py-2 rounded bg-gray-100 text-est-blue">
//                 <FaUpload className="mr-2" /> Télécharger Ressources
//               </Link>
//             </li>
//             <li>
//               <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
//                 <FaClipboardCheck className="mr-2" /> Évaluations
//               </Link>
//             </li>
//           </ul>
          
//           <h2 className="text-est-blue text-lg font-semibold mt-8 mb-4 pb-2 border-b border-gray-200">Encadrement</h2>
//           <ul className="space-y-2">
//             <li>
//               <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
//                 <FaUserEdit className="mr-2" /> Suivi des Étudiants
//               </Link>
//             </li>
//             <li>
//               <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
//                 <FaTasks className="mr-2" /> Projets et Mémoires
//               </Link>
//             </li>
//           </ul>
          
//           <h2 className="text-est-blue text-lg font-semibold mt-8 mb-4 pb-2 border-b border-gray-200">Administration</h2>
//           <ul className="space-y-2">
//             <li>
//               <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
//                 <FaFileAlt className="mr-2" /> Emplois du Temps
//               </Link>
//             </li>
//             <li>
//               <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
//                 <FaCalendarAlt className="mr-2" /> Calendrier Pédagogique
//               </Link>
//             </li>
//             <li>
//               <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
//                 <FaChartLine className="mr-2" /> Statistiques
//               </Link>
//             </li>
//           </ul>
//         </aside>
        
//         {/* Main Content Area */}
//         <main className="flex-1 p-8 bg-white m-4 rounded-lg shadow-sm">
//           <div className="welcome-banner bg-est-blue text-white p-8 rounded-lg mb-8 text-center">
//             <h1 className="text-2xl font-bold mb-4">
//               Télécharger une Ressource Pédagogique
//             </h1>
//             <p className="text-lg opacity-90 mb-6">Ajoutez vos fichiers PDF pour vos cours</p>
//           </div>

//           <div className="upload-form bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//             <h2 className="text-est-blue text-lg font-semibold mb-4">Formulaire de Téléchargement</h2>
//             {error && (
//               <p className="text-red-500 mb-4">{error}</p>
//             )}
//             {success && (
//               <p className="text-green-500 mb-4">{success}</p>
//             )}
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label htmlFor="file" className="block text-sm font-medium text-gray-700">
//                   Fichier PDF
//                 </label>
//                 <input
//                   id="fileInput"
//                   type="file"
//                   accept=".pdf"
//                   onChange={handleFileChange}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-est-blue"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="filiere" className="block text-sm font-medium text-gray-700">
//                   Filière
//                 </label>
//                 <input
//                   type="text"
//                   id="filiere"
//                   name="filiere"
//                   value={formData.filiere}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-est-blue"
//                   placeholder="Ex: Informatique"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="module" className="block text-sm font-medium text-gray-700">
//                   Module
//                 </label>
//                 <input
//                   type="text"
//                   id="module"
//                   name="module"
//                   value={formData.module}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-est-blue"
//                   placeholder="Ex: Programmation"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="element" className="block text-sm font-medium text-gray-700">
//                   Élément
//                 </label>
//                 <input
//                   type="text"
//                   id="element"
//                   name="element"
//                   value={formData.element}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-est-blue"
//                   placeholder="Ex: Cours 1"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="titre" className="block text-sm font-medium text-gray-700">
//                   Titre
//                 </label>
//                 <input
//                   type="text"
//                   id="titre"
//                   name="titre"
//                   value={formData.titre}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-est-blue"
//                   placeholder="Ex: Introduction à Python"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`w-full bg-est-blue text-white px-6 py-3 rounded hover:bg-blue-900 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//               >
//                 {loading ? 'Téléchargement...' : 'Télécharger'}
//               </button>
//             </form>
//           </div>
//         </main>
//       </div>
      
//       {/* AI Assistant */}
//       <div 
//         className="ai-assistant fixed bottom-8 right-8 bg-est-blue text-white w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition" 
//         title="Assistant IA Ollama"
//       >
//         <FaRobot className="text-2xl" />
//       </div>
//     </div>
//   );
// };

// export default UploadPage;











import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaChalkboardTeacher, 
  FaBook, 
  FaUsers, 
  FaQuestionCircle, 
  FaEnvelope, 
  FaBell, 
  FaFileAlt, 
  FaCalendarAlt,
  FaChartLine,
  FaUserEdit,
  FaTasks,
  FaClipboardCheck,
  FaRobot,
  FaUpload
} from 'react-icons/fa';

const UploadPage = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    filiere: '',
    module: '',
    element: '',
    titre: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [files, setFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [filesError, setFilesError] = useState(null);

  useEffect(() => {
    if (user?.token) {
      fetchFiles();
    }
  }, [user]);

  const fetchFiles = async () => {
    setFilesLoading(true);
    setFilesError(null);
    try {
      const response = await fetch('http://localhost:8005/list-files/', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to fetch files.');
      }
      setFiles(data.files || []);
    } catch (err) {
      setFilesError(err.message || 'An unexpected error occurred while fetching files.');
    } finally {
      setFilesLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      setError('Please select a PDF file.');
      setFile(null);
    } else {
      setError(null);
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !formData.filiere || !formData.module || !formData.element || !formData.titre) {
      setError('Please fill in all fields and select a PDF file.');
      return;
    }

    if (!user?.token) {
      setError('Authentication token is missing. Please log in again.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const form = new FormData();
    form.append('file', file);
    form.append('filiere', formData.filiere);
    form.append('module', formData.module);
    form.append('element', formData.element);
    form.append('titre', formData.titre);

    try {
      const response = await fetch('http://localhost:8005/upload/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: form,
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or expired token. Please log in again.');
        }
        throw new Error(data.detail || 'Failed to upload file.');
      }

      setSuccess(`File uploaded successfully! Path: ${data.path}`);
      setFormData({ filiere: '', module: '', element: '', titre: '' });
      setFile(null);
      document.getElementById('fileInput').value = '';
      // Refresh file list after upload
      await fetchFiles();
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Please log in to access this page.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      <div className="flex flex-1">
        <aside className="sidebar w-64 bg-white p-6 shadow-md">
          <h2 className="text-est-blue text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Enseignement</h2>
          <ul className="space-y-2">
            <li>
              <Link to="/espace-enseignant" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
                <FaChalkboardTeacher className="mr-2" /> Mes Cours
              </Link>
            </li>
            <li>
              <Link to="/upload" className="flex items-center px-3 py-2 rounded bg-gray-100 text-est-blue">
                <FaUpload className="mr-2" /> Télécharger Ressources
              </Link>
            </li>
            <li>
              <Link to="/download" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
                <FaUpload className="mr-2" /> Télécharger Fichiers
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
                <FaClipboardCheck className="mr-2" /> Évaluations
              </Link>
            </li>
          </ul>
          
          <h2 className="text-est-blue text-lg font-semibold mt-8 mb-4 pb-2 border-b border-gray-200">Encadrement</h2>
          <ul className="space-y-2">
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
                <FaUserEdit className="mr-2" /> Suivi des Étudiants
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
                <FaTasks className="mr-2" /> Projets et Mémoires
              </Link>
            </li>
          </ul>
          
          <h2 className="text-est-blue text-lg font-semibold mt-8 mb-4 pb-2 border-b border-gray-200">Administration</h2>
          <ul className="space-y-2">
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
                <FaFileAlt className="mr-2" /> Emplois du Temps
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
                <FaCalendarAlt className="mr-2" /> Calendrier Pédagogique
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
                <FaChartLine className="mr-2" /> Statistiques
              </Link>
            </li>
          </ul>
        </aside>
        
        <main className="flex-1 p-8 bg-white m-4 rounded-lg shadow-sm">
          <div className="welcome-banner bg-est-blue text-white p-8 rounded-lg mb-8 text-center">
            <h1 className="text-2xl font-bold mb-4">
              Télécharger une Ressource Pédagogique
            </h1>
            <p className="text-lg opacity-90 mb-6">Ajoutez vos fichiers PDF pour vos cours</p>
          </div>

          <div className="upload-form bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
            <h2 className="text-est-blue text-lg font-semibold mb-4">Formulaire de Téléchargement</h2>
            {error && (
              <p className="text-red-500 mb-4">{error}</p>
            )}
            {success && (
              <p className="text-green-500 mb-4">{success}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                  Fichier PDF
                </label>
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-est-blue"
                />
              </div>
              <div>
                <label htmlFor="filiere" className="block text-sm font-medium text-gray-700">
                  Filière
                </label>
                <input
                  type="text"
                  id="filiere"
                  name="filiere"
                  value={formData.filiere}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-est-blue"
                  placeholder="Ex: Informatique"
                />
              </div>
              <div>
                <label htmlFor="module" className="block text-sm font-medium text-gray-700">
                  Module
                </label>
                <input
                  type="text"
                  id="module"
                  name="module"
                  value={formData.module}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-est-blue"
                  placeholder="Ex: Programmation"
                />
              </div>
              <div>
                <label htmlFor="element" className="block text-sm font-medium text-gray-700">
                  Élément
                </label>
                <input
                  type="text"
                  id="element"
                  name="element"
                  value={formData.element}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-est-blue"
                  placeholder="Ex: Cours 1"
                />
              </div>
              <div>
                <label htmlFor="titre" className="block text-sm font-medium text-gray-700">
                  Titre
                </label>
                <input
                  type="text"
                  id="titre"
                  name="titre"
                  value={formData.titre}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-est-blue"
                  placeholder="Ex: Introduction à Python"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-est-blue text-white px-6 py-3 rounded hover:bg-blue-900 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Téléchargement...' : 'Télécharger'}
              </button>
            </form>
          </div>

          <div className="file-list bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-est-blue text-lg font-semibold mb-4">Fichiers Téléchargés</h2>
            {filesError && (
              <p className="text-red-500 mb-4">{filesError}</p>
            )}
            {filesLoading ? (
              <p className="text-gray-600">Chargement des fichiers...</p>
            ) : files.length === 0 ? (
              <p className="text-gray-600">Aucun fichier téléchargé.</p>
            ) : (
              <ul className="space-y-4">
                {files.map((file) => (
                  <li key={file.object_name} className="p-4 border border-gray-200 rounded">
                    <p className="font-medium">{file.object_name}</p>
                    <p className="text-sm text-gray-600">
                      Filière: {file.metadata['x-amz-meta-filiere']} | Module: {file.metadata['x-amz-meta-module']} | 
                      Élément: {file.metadata['x-amz-meta-element']} | Titre: {file.metadata['x-amz-meta-titre']}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
      
      <div 
        className="ai-assistant fixed bottom-8 right-8 bg-est-blue text-white w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition" 
        title="Assistant IA Ollama"
      >
        <FaRobot className="text-2xl" />
      </div>
    </div>
  );
};

export default UploadPage;