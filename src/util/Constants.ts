export const KEYCLOAK_URL: string = "http://localhost:8081"
export const KEYCLOAK_REALM: string = "cargotransportation-realm"
export const KEYCLOAK_URI: string = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect`;
export const KEYCLOAK_CLIENT_ID: string = "cargotransportation-client"
export const KEYCLOAK_RESPONSE_TYPE: string = 'code';
export const KEYCLOAK_SCOPE: string = 'openid';
export const KEYCLOAK_CODE_CHALLENGE_METHOD: string = 'S256';

export const CLIENT_ROOT_URI: string = 'http://localhost:3000/main'


export const SERVER_CORE_URI: string = 'http://localhost:8083'
export const API_V1_USER_PREFIX: string = 'api/v1/user'

export const SERVER_ROUTE_URI: string = 'http://localhost:8082'
export const API_V1_ROUTE_PREFIX: string = 'api/v1/routes'
export const API_V1_SINGLE_ROUTE_PREFIX: string = 'api/v1/route'