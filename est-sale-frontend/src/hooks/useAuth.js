// src/hooks/useAuth.js
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import keycloak from '../keycloak';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const initialized = useRef(false);  // Ensures Keycloak only initializes once

  useEffect(() => {
    // Check if the user token is already stored in localStorage
    const storedToken = localStorage.getItem('keycloak_token');
    const storedUser = JSON.parse(localStorage.getItem('keycloak_user'));
    if (storedToken && storedUser) {
      // If stored token and user data exist, restore session
      keycloak.token = storedToken;
      keycloak.tokenParsed = storedUser;
      setUser(storedUser);
    }

    if (initialized.current) return; // Avoid re-initializing Keycloak
    initialized.current = true;

    keycloak
      .init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      })
      .then((authenticated) => {
        if (authenticated) {
          const profile = {
            username: keycloak.tokenParsed?.preferred_username,
            role: keycloak.tokenParsed?.realm_access?.roles?.[0] || 'user',
          };
          setUser(profile);
          
          // Store the token and user data in localStorage for persistence
          localStorage.setItem('keycloak_token', keycloak.token);
          localStorage.setItem('keycloak_user', JSON.stringify(profile));
        }
      })
      .catch((err) => {
        console.error('Keycloak init failed', err);
      });
  }, []);

  const login = () => {
    keycloak.login();
  };

  const logout = () => {
    // Remove session data from localStorage on logout
    localStorage.removeItem('keycloak_token');
    localStorage.removeItem('keycloak_user');
    keycloak.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
