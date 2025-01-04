import {v4 as uuidv4} from 'uuid';
import {
    KEYCLOAK_CLIENT_ID,
    KEYCLOAK_CODE_CHALLENGE_METHOD,
    KEYCLOAK_REALM,
    KEYCLOAK_RESPONSE_TYPE,
    KEYCLOAK_SCOPE,
    KEYCLOAK_URL
} from "./Constants";
import Keycloak from "keycloak-js";
import {getKeycloakInstance} from "../components/auth/KeycloakService";

const ALGORITHM: string = 'SHA-256'

const keycloak: Keycloak = getKeycloakInstance()

export const generateRandomState = (): string => {
    return uuidv4();
}

export const generateCodeVerifier = (): string => {
    const randomByteArray: Uint8Array = new Uint8Array(43);
    window.crypto.getRandomValues(randomByteArray);
    return base64URLEncode(randomByteArray);
}

export const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
    const codeVerifierByteArray: Uint8Array = new TextEncoder().encode(codeVerifier);
    const digest: ArrayBuffer = await window.crypto.subtle.digest(ALGORITHM, codeVerifierByteArray);
    return base64URLEncode(Array.from(new Uint8Array(digest)));
}

const base64URLEncode = (sourceValues: any): string => {
    const stringValue: string = String.fromCharCode.apply(null, sourceValues)
    const base64Encoded: string = btoa(stringValue)
    return base64Encoded.replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
}

export const parseJwt = (token: string): TokenId => {
    const base64Url: string = token.split('.')[1];
    const base64: string = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload: string = decodeURIComponent(
        window
            .atob(base64)
            .split('')
            .map((c: string): string => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );

    return JSON.parse(jsonPayload);
}

export interface TokenId {
    given_name: string,
    family_name: string,
    sub: string,
    email: string,
    adminUsername: string | undefined
}


export const authenticate = (): null => {
    const state: string = generateRandomState()
    const codeVerifier: string = generateCodeVerifier()
    generateCodeChallenge(codeVerifier).then((codeChallenge: string): void => {
        localStorage.setItem('pkce_state', state);
        localStorage.setItem('pkce_code_verifier', codeVerifier);

        window.location.href = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth` +
            `?client_id=${KEYCLOAK_CLIENT_ID}` +
            `&redirect_uri=${window.location.origin}` +
            `&response_type=${KEYCLOAK_RESPONSE_TYPE}` +
            `&scope=${KEYCLOAK_SCOPE}` +
            `&state=${state}` +
            `&code_challenge=${codeChallenge}` +
            `&code_challenge_method=${KEYCLOAK_CODE_CHALLENGE_METHOD}`;
    });

    return null
}

export const getRole = (): string[] => {
    return keycloak.resourceAccess['cargotransportation-client'].roles
}


export const isAdmin = (): boolean => {
    return getRole().find((role: string): boolean => role === 'admin') !== undefined
}