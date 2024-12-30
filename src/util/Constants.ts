export const KEYCLOAK_URI: string = 'http://localhost:8080/realms/cargotransportation-realm/protocol/openid-connect';
export const AUTH_CODE_REDIRECT_URI: string = 'http://localhost:3000/redirect';
export const ACCESS_TOKEN_REDIRECT_URI: string = 'http://localhost:3000/redirect';
export const RESPONSE_TYPE: string = 'code';
export const SCOPE: string = 'openid';
export const CLIENT_ID: string = 'cargotransportation-client';
export const CODE_CHALLENGE_METHOD: string = 'S256';
export const GRANT_TYPE_AUTHORIZATION_CODE: string = 'authorization_code';
export const RESOURCE_SERVER_ADMIN_URI: string = 'http://localhost:8081/test/admin'
export const RESOURCE_SERVER_USER_URI: string = 'http://localhost:8081/test/user'
export const CLIENT_ROOT_URI: string = 'http://localhost:3000/auth'


export const REACT_APP_KEYCLOAK_URL: string = "http://localhost:8080"
export const REACT_APP_KEYCLOAK_REALM: string = "cargotransportation-realm"
export const REACT_APP_KEYCLOAK_CLIENT_ID: string = "cargotransportation-client"