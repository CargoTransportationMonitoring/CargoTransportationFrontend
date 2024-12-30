export const KEYCLOAK_URL: string = "http://localhost:8080"
export const KEYCLOAK_REALM: string = "cargotransportation-realm"
export const KEYCLOAK_URI: string = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect`;
export const KEYCLOAK_CLIENT_ID: string = "cargotransportation-client"
export const KEYCLOAK_RESPONSE_TYPE: string = 'code';
export const KEYCLOAK_SCOPE: string = 'openid';
export const KEYCLOAK_CODE_CHALLENGE_METHOD: string = 'S256';

export const CLIENT_ROOT_URI: string = 'http://localhost:3000/main'


export const SERVER_ADMIN_URI: string = 'http://localhost:8081/test/admin'
export const SERVER_USER_URI: string = 'http://localhost:8081/test/user'
export const SERVER_URI: string = 'http://localhost:8081'

export const API_V1_USER_PREFIX: string = 'api/v1/user'