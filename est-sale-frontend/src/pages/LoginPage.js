import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login({ email, password });
      // Navigation is now handled in the auth context after successful login
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-md">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
          <h1 className="text-2xl md:text-3xl font-bold text-est-blue mb-6 text-center">Connexion</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue"
                placeholder="votre@email.ma"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue"
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-est-blue text-white py-2 px-4 rounded-md hover:bg-blue-900 transition disabled:opacity-50"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Pas encore de compte?{' '}
              <a href="/inscription" className="text-est-blue hover:underline">S'inscrire</a>
            </p>
            <p className="mt-2">
              <a href="/mot-de-passe-oublie" className="text-est-blue hover:underline text-sm">
                Mot de passe oublié?
              </a>
            </p>
          </div>
        </div>
      </main>

    </>
  );
};

export default LoginPage;