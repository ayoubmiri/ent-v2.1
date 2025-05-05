// src/keycloak.js
import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:8080/auth', // Ensure this matches your Keycloak server URL
  realm: 'ent-realm', 
  clientId: 'ent-client' 
};

const keycloak = new Keycloak(keycloakConfig);

export const initKeycloak = (onAuthenticatedCallback) => {
  return keycloak.init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    checkLoginIframe: false,
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
  })
  .then((authenticated) => {
    if (authenticated) {
      onAuthenticatedCallback();
    }
    return authenticated;
  })
  .catch((error) => {
    console.error('Keycloak initialization error', error);
    return false;
  });
};

export default keycloak;