import { useState, useEffect, useContext, createContext } from 'react';
import { auth } from '../services/auth';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await auth.checkAuth();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const userData = await auth.login(credentials);
      setUser(userData);
      
      // Redirect based on role after login
      if (userData.role === 'etudiant') {
        navigate('/profil/etudiant');
      } else if (userData.role === 'enseignant') {
        navigate('/profil/enseignant');
      }
      
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
      setUser(null);
      navigate('/');
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);