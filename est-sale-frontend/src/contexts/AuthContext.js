// src/contexts/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const initKeycloak = async () => {
      const keycloakInstance = new Keycloak({
        url: process.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:8080',
        realm: process.env.REACT_APP_KEYCLOAK_REALM || 'ent-realm',
        clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || 'ent-client'
      });

      try {
        const auth = await keycloakInstance.init({ 
          onLoad: 'check-sso',
          checkLoginIframe: false
        });
        
        setKeycloak(keycloakInstance);
        setAuthenticated(auth);
      } catch (error) {
        console.error('Keycloak initialization error:', error);
      }
    };

    initKeycloak();
  }, []);

  const login = () => keycloak?.login();
  const logout = () => keycloak?.logout();

  const value = {
    keycloak,
    authenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};