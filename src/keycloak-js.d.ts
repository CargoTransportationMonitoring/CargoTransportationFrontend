declare module 'keycloak-js' {
    export default class Keycloak {
        constructor(config?: Keycloak.KeycloakConfig);

        init(options?: Keycloak.KeycloakInitOptions): Promise<boolean>;
        login(options?: Keycloak.KeycloakLoginOptions): Promise<void>;
        logout(options?: Keycloak.KeycloakLogoutOptions): Promise<void>;
        createAccountUrl(): string;
        createLoginUrl(): string;
        createLogoutUrl(options?: Keycloak.KeycloakLogoutOptions): string;
        updateToken(minValidity: number): Promise<boolean>;
        isTokenExpired(minValidity?: number): boolean;
        authenticated?: boolean;
        token: string;
        idToken: string;
        realmAccess: Keycloak.KeycloakRoles;
        resourceAccess: Keycloak.KeycloakResourceAccess;

        onAuthSuccess?: () => void;
        onAuthError?: (errorData: any) => void;
        onAuthRefreshSuccess?: () => void;
        onAuthRefreshError?: () => void;
        onAuthLogout?: () => void;
        onTokenExpired?: () => void;
    }

    export namespace Keycloak {
        interface KeycloakConfig {
            url?: string;
            realm?: string;
            clientId?: string;
        }

        interface KeycloakInitOptions {
            onLoad?: 'login-required' | 'check-sso';
            checkLoginIframe?: boolean;
            checkLoginIframeInterval?: number;
            flow?: 'standard' | 'implicit' | 'hybrid';
            pkceMethod?: 'S256';
        }

        interface KeycloakLoginOptions {
            scope?: string;
            redirectUri?: string;
        }

        interface KeycloakLogoutOptions {
            redirectUri?: string;
        }

        interface KeycloakResourceAccess {
            [clientId: string]: KeycloakRoles;
        }

        interface KeycloakRoles {
            roles: string[];
        }
    }
}
