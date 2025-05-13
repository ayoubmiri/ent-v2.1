import React from 'react';
import { Link } from 'react-router-dom';
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
  FaRobot
} from 'react-icons/fa';

const EspaceEnseignant = () => {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="sidebar w-64 bg-white p-6 shadow-md">
          <h2 className="text-est-blue text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Enseignement</h2>
          <ul className="space-y-2">
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded bg-gray-100 text-est-blue">
                <FaChalkboardTeacher className="mr-2" /> Mes Cours
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
                <FaBook className="mr-2" /> Ressources Pédagogiques
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
        
        {/* Main Content Area */}
        <main className="flex-1 p-8 bg-white m-4 rounded-lg shadow-sm">
          <div className="welcome-banner bg-est-blue text-white p-8 rounded-lg mb-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Espace Enseignant</h1>
            <p className="text-lg opacity-90 mb-6">Outils pédagogiques et administratifs pour les enseignants</p>
            <button className="bg-est-yellow text-black px-6 py-2 rounded hover:bg-yellow-600 transition">
              Consulter le guide
            </button>
          </div>
          
          <div className="search-bar flex mb-8">
            <input 
              type="text" 
              placeholder="Rechercher un cours, étudiant ou ressource..." 
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-est-blue"
            />
            <button className="bg-est-blue text-white px-6 rounded-r hover:bg-blue-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          
          <ServiceGrid />
        </main>
      </div>
      
      {/* AI Assistant */}
      <div 
        className="ai-assistant fixed bottom-8 right-8 bg-est-blue text-white w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition" 
        title="Assistant IA Ollama"
      >
        <FaRobot className="text-2xl" />
      </div>
    </div>
  );
};

// Service Grid Component
const ServiceGrid = () => {
  const services = [
    {
      icon: <FaChalkboardTeacher className="mr-2" />,
      title: "Gestion des Cours",
      description: "Planifier vos cours, déposer des ressources et suivre les progressions.",
      link: "#"
    },
    {
      icon: <FaClipboardCheck className="mr-2" />,
      title: "Évaluation",
      description: "Saisir les notes, créer des grilles d'évaluation et analyser les résultats.",
      link: "#"
    },
    {
      icon: <FaUserEdit className="mr-2" />,
      title: "Suivi des Étudiants",
      description: "Consulter les dossiers étudiants et suivre leur progression académique.",
      link: "#"
    },
    {
      icon: <FaTasks className="mr-2" />,
      title: "Encadrement",
      description: "Gérer les projets de recherche et les mémoires encadrés.",
      link: "#"
    },
    {
      icon: <FaCalendarAlt className="mr-2" />,
      title: "Planification",
      description: "Consulter et gérer votre emploi du temps et vos disponibilités.",
      link: "#"
    },
    {
      icon: <FaChartLine className="mr-2" />,
      title: "Statistiques",
      description: "Analyser les résultats pédagogiques et les taux de réussite.",
      link: "#"
    }
  ];

  return (
    <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {services.map((service, index) => (
        <ServiceCard key={index} service={service} />
      ))}
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ service }) => {
  return (
    <div className="service-card bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border border-gray-100 hover:-translate-y-1">
      <h3 className="text-est-blue font-semibold mb-2 flex items-center">
        {service.icon} {service.title}
      </h3>
      <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
      <Link to={service.link} className="text-est-blue font-medium text-sm hover:underline flex items-center">
        Accéder <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
};

export default EspaceEnseignant;