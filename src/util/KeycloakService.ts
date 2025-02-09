import Keycloak from 'keycloak-js';
import {KEYCLOAK_CLIENT_ID, KEYCLOAK_REALM, KEYCLOAK_URL} from "./Constants";

const keycloak: Keycloak = new Keycloak({
    url: KEYCLOAK_URL,
    realm: KEYCLOAK_REALM,
    clientId: KEYCLOAK_CLIENT_ID,
})

export const initKeycloak = (): Promise<void> =>
    new Promise((resolve, reject): void => {
        keycloak
            .init({
                onLoad: 'login-required',
                checkLoginIframe: true,
                checkLoginIframeInterval: 10
            })
            .then((authenticated: boolean): void => {
                if (!authenticated) {
                    console.warn('User is not authenticated!');
                }

                setInterval((): void => {
                    keycloak.updateToken(70).then((refreshed: boolean): void => {
                        if (refreshed) {
                            console.log("Token was successfully refreshed");
                        }
                    }).catch((error): void => {
                        console.error("Failed to update token", error);
                    });
                }, 60000);

                resolve();
            })
            .catch(reject);
    })

export const getKeycloakInstance = (): Keycloak => keycloak
export const isAuthenticated = (): boolean => keycloak.authenticated ? keycloak.authenticated : false
export const getToken = (): string => keycloak.token
export const getIdToken = (): string => keycloak.idToken
