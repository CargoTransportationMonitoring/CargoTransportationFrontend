import React, {JSX, useEffect, useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './App.css';
import InfoSection from "./components/Menu/info/InfoSection";
import NotFound from "./components/NotFound/NotFound";
import AdminRouteTab from "./components/Administrator/Tabs/route/AdminRouteTab";
import CarrierRouteTab from "./components/СargoСarrier/Tabs/route/CarrierRouteTab";
import {authenticate, getRole} from "./util/KeycloakUtils";
import {
    getIdToken,
    getKeycloakInstance,
    getToken,
    initKeycloak,
    isAuthenticated
} from "./util/KeycloakService";
import MainLayout from "./components/Menu/MainLayout";
import UserProfile from "./components/Menu/profile/UserProfile";

interface ProtectedRouteProps {
    requiredRoles: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({requiredRoles}: ProtectedRouteProps): null | JSX.Element => {
    if (!isAuthenticated()) {
        authenticate()
    }

    if (requiredRoles && requiredRoles.length > 0) {
        const userRoles: string[] = getRole();
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
                    <Route path="profile" element={<UserProfile/>}/>
                    <Route path="routes" element={<CarrierRouteTab/>}/>
                </Route>

                {/* Защищенные маршруты для администратора */}
                <Route path="/admin" element={<ProtectedRoute requiredRoles={['admin']}/>}>
                    <Route path="profile" element={<UserProfile/>}/>
                    <Route path="routes" element={<AdminRouteTab/>}/>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound role={
                    getKeycloakInstance().resourceAccess['cargotransportation-client'].roles[0]
                }/>}/>
            </Routes>
            <InfoSection/>
        </BrowserRouter>
    )
}

export default App;
