import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminNews from '../components/admin/AdminNews';
import AdminEvents from '../components/admin/AdminEvents';
import AdminFormations from '../components/admin/AdminFormations';
import AdminTestimonials from '../components/admin/AdminTestimonials';
import AdminStats from '../components/admin/AdminStats';

const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('news');

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl text-red-500">Accès refusé</h1>
        <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-est-blue mb-8">Panneau d'administration</h1>
      
      <div className="flex border-b border-gray-200 mb-6">
        {['news', 'events', 'formations', 'testimonials', 'stats'].map(tab => (
          <button
            key={tab}
            className={`py-2 px-4 font-medium ${activeTab === tab ? 'text-est-blue border-b-2 border-est-blue' : 'text-gray-500'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'news' && <AdminNews />}
        {activeTab === 'events' && <AdminEvents />}
        {activeTab === 'formations' && <AdminFormations />}
        {activeTab === 'testimonials' && <AdminTestimonials />}
        {activeTab === 'stats' && <AdminStats />}
      </div>
    </div>
  );
};

export default AdminPage;