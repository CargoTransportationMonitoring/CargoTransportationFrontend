import Keycloak from "keycloak-js";
import React, {JSX, useEffect, useState} from "react";
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import './App.css';
import Menu from "./components/Menu/Menu";
import Error from "./components/Error/Error";
import NotFound from "./components/NotFound/NotFound";
import AdminRouteTab from "./components/Administrator/Tabs/AdminRouteTab";
import AdminCargoTab from "./components/Administrator/Tabs/AdminCargoTab";
import CarrierRouteTab from "./components/СargoСarrier/Tabs/CarrierRouteTab";
import CarrierCargoTab from "./components/СargoСarrier/Tabs/CarrierCargoTab";
import AdminProfileTab from "./components/Administrator/Tabs/AdminProfileTab";
import CarrierProfileTab from "./components/СargoСarrier/Tabs/CarrierProfileTab";
import {generateCodeChallenge, generateCodeVerifier, generateRandomState} from "./util/KeycloakUtils";
import {getKeycloakInstance, getToken, initKeycloak, isAuthenticated} from "./components/auth/KeycloakService";
import {
    KEYCLOAK_CODE_CHALLENGE_METHOD,
    KEYCLOAK_CLIENT_ID,
    KEYCLOAK_REALM,
    KEYCLOAK_URL,
    KEYCLOAK_RESPONSE_TYPE,
    KEYCLOAK_SCOPE
} from "./util/Constants";
import MainLayout from "./components/Menu/MainLayout";

interface ProtectedRouteProps {
    requiredRoles: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({requiredRoles}: ProtectedRouteProps): null | JSX.Element => {
    const keycloak: Keycloak = getKeycloakInstance()

    if (!isAuthenticated()) {
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

    if (requiredRoles && requiredRoles.length > 0) {
        const userRoles: string[] = keycloak.resourceAccess['cargotransportation-client'].roles;
        const hasAtLeastOneRole: boolean = requiredRoles.some(role => userRoles.includes(role));
        console.log('userRoles: ', userRoles)
        console.log(getToken())
        if (!hasAtLeastOneRole) {
            return <div>Доступ запрещён</div>;
        }
    }


    return (
        <MainLayout/>
    );
};

const App: React.FC = (): JSX.Element => {

    const [keycloakInitialized, setKeycloakInitialized] = useState<boolean>(false);

    useEffect((): void => {
        initKeycloak()
            .then(() => setKeycloakInitialized(true))
            .catch(error => {
                console.error("Failed to initialize Keycloak", error);
            });
    }, []);

    if (!keycloakInitialized) {
        return <div>Loading...</div>
    }


    return (
        <BrowserRouter>
            <Routes>
                {/* Защищенные маршруты для перевозчика */}
                <Route path="/main" element={<ProtectedRoute requiredRoles={['user']}/>}>
                    <Route path="profile" element={<CarrierProfileTab/>}/>
                    <Route path="cargos" element={<CarrierCargoTab/>}/>
                    <Route path="routes" element={<CarrierRouteTab/>}/>
                </Route>

                {/* Защищенные маршруты для администратора */}
                <Route path="/admin" element={<ProtectedRoute requiredRoles={['admin']}/>}>
                    <Route path="profile" element={<AdminProfileTab/>}/>
                    <Route path="cargos" element={<AdminCargoTab/>}/>
                    <Route path="routes" element={<AdminRouteTab/>}/>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound/>}/>
            </Routes>
            <Error/>
        </BrowserRouter>
    )
}

export default App;
