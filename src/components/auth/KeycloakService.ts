import Keycloak from 'keycloak-js';
import {REACT_APP_KEYCLOAK_CLIENT_ID, REACT_APP_KEYCLOAK_REALM, REACT_APP_KEYCLOAK_URL} from "../../util/Constants";

const keycloak: Keycloak = new Keycloak({
    url: REACT_APP_KEYCLOAK_URL,
    realm: REACT_APP_KEYCLOAK_REALM,
    clientId: REACT_APP_KEYCLOAK_CLIENT_ID,
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
