import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "ent-realm",
  clientId: "ent-client",
});

export default keycloak;
