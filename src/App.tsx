import Keycloak from "keycloak-js";
import React, {JSX, useEffect, useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './App.css';
import Error from "./components/Error/Error";
import NotFound from "./components/NotFound/NotFound";
import AdminRouteTab from "./components/Administrator/Tabs/route/AdminRouteTab";
import AdminCargoTab from "./components/Administrator/Tabs/AdminCargoTab";
import CarrierRouteTab from "./components/СargoСarrier/Tabs/CarrierRouteTab";
import CarrierCargoTab from "./components/СargoСarrier/Tabs/CarrierCargoTab";
import AdminProfileTab from "./components/Administrator/Tabs/AdminProfileTab";
import CarrierProfileTab from "./components/СargoСarrier/Tabs/CarrierProfileTab";
import {authenticate} from "./util/KeycloakUtils";
import {
    getIdToken,
    getKeycloakInstance,
    getToken,
    initKeycloak,
    isAuthenticated
} from "./components/auth/KeycloakService";
import MainLayout from "./components/Menu/MainLayout";
import AdminUsersTab from "./components/Administrator/Tabs/users/AdminUsersTab";

interface ProtectedRouteProps {
    requiredRoles: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({requiredRoles}: ProtectedRouteProps): null | JSX.Element => {
    const keycloak: Keycloak = getKeycloakInstance()

    if (!isAuthenticated()) {
        authenticate()
    }

    if (requiredRoles && requiredRoles.length > 0) {
        const userRoles: string[] = keycloak.resourceAccess['cargotransportation-client'].roles;
        const hasAtLeastOneRole: boolean = requiredRoles.some((role: string) => userRoles.includes(role));
        console.log('userRoles: ', userRoles)
        console.log(getToken())
        console.log(getIdToken())
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
                    <Route path="users" element={<AdminUsersTab/>}/>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound role={
                    getKeycloakInstance().resourceAccess['cargotransportation-client'].roles[0]
                }/>}/>
            </Routes>
            <Error/>
        </BrowserRouter>
    )
}

export default App;
