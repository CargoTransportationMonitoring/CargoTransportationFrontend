import './App.css';
import React, {JSX, useEffect, useState} from "react";
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import Error from "./components/Error/Error";
import CarrierProfileTab from "./components/СargoСarrier/Tabs/CarrierProfileTab";
import CarrierCargoTab from "./components/СargoСarrier/Tabs/CarrierCargoTab";
import CarrierRouteTab from "./components/СargoСarrier/Tabs/CarrierRouteTab";
import AdminProfileTab from "./components/Administrator/Tabs/AdminProfileTab";
import AdminCargoTab from "./components/Administrator/Tabs/AdminCargoTab";
import AdminRouteTab from "./components/Administrator/Tabs/AdminRouteTab";
import NotFound from "./components/NotFound/NotFound";
import {getKeycloakInstance, getToken, initKeycloak, isAuthenticated} from "./components/auth/KeycloakService";
import Menu from "./components/Menu/Menu";
import {generateCodeChallenge, generateCodeVerifier, generateRandomState} from "./util/KeycloakUtils";
import Keycloak from "keycloak-js";
import {REACT_APP_KEYCLOAK_CLIENT_ID, REACT_APP_KEYCLOAK_REALM, REACT_APP_KEYCLOAK_URL} from "./util/Constants";

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

            window.location.href = `${REACT_APP_KEYCLOAK_URL}/realms/${REACT_APP_KEYCLOAK_REALM}/protocol/openid-connect/auth` +
                `?client_id=${REACT_APP_KEYCLOAK_CLIENT_ID}` +
                `&redirect_uri=${window.location.origin}` +
                `&response_type=code` +
                `&scope=openid` +
                `&state=${state}` +
                `&code_challenge=${codeChallenge}` +
                `&code_challenge_method=S256`;
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
        <>
            <Menu/>
            <Outlet/>
        </>
    );
};

const App: React.FC = (): JSX.Element => {

    const [keycloakInitialized, setKeycloakInitialized] = useState(false);

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
