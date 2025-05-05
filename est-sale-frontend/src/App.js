import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import FormationsPage from './pages/FormationsPage';
import NewsPage from './pages/NewsPage';
import EventsPage from './pages/EventsPage';
import ResearchPage from './pages/ResearchPage';
import ContactPage from './pages/ContactPage';
import AdmissionPage from './pages/AdmissionPage';
import EtudiantProfile from './pages/EtudiantProfile';
import EnseignantProfile from './pages/EnseignantProfile';
import PrivateRoute from './components/common/PrivateRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

function App() {
  return (
    <div className="font-sans bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/formations" element={<FormationsPage />} />
          <Route path="/actualites" element={<NewsPage />} />
          <Route path="/admission" element={<AdmissionPage />} />
          <Route path="/recherche" element={<ResearchPage />} />
          <Route path="/actualites" element={<NewsPage />} />
          <Route path="/evenements" element={<EventsPage />} />
          <Route path="/connexion" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/connexion" element={<LoginPage />} />
          
          {/* Protected routes */}
          <Route element={<PrivateRoute role="etudiant" />}>
            <Route path="/profil/etudiant" element={<EtudiantProfile />} />
          </Route>
          
          <Route element={<PrivateRoute role="enseignant" />}>
            <Route path="/profil/enseignant" element={<EnseignantProfile />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
