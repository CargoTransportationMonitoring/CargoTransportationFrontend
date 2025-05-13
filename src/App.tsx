import React, {JSX, useEffect, useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './App.css';
import InfoSection from "./components/Menu/info/InfoSection";
import NotFound from "./components/NotFound/NotFound";
import AdminRouteTab from "./components/Administrator/Tabs/route/AdminRouteTab";
import CarrierRouteTab from "./components/СargoСarrier/Tabs/route/CarrierRouteTab";
import {authenticate, getRole, parseJwt, TokenId} from "./util/KeycloakUtils";
import {
    getIdToken,
    getToken,
    initKeycloak,
    isAuthenticated
} from "./util/KeycloakService";
import MainLayout from "./components/Menu/MainLayout";
import UserProfile from "./components/Menu/profile/UserProfile";
import UsersTab from "./components/Administrator/Tabs/users/UsersTab";
import {Client} from "@stomp/stompjs";
import startSharingLocation from "./util/GeolocationUtil";

interface ProtectedRouteProps {
    requiredRoles: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({requiredRoles}: ProtectedRouteProps): null | JSX.Element => {
    if (!isAuthenticated()) {
        authenticate()
    }

    if (requiredRoles && requiredRoles.length > 0) {
        const userRoles: string = getRole();
        const hasAtLeastOneRole: boolean = requiredRoles.some((role: string) => userRoles.includes(role));
        console.log(getToken())
        console.log(getIdToken())
        if (!hasAtLeastOneRole) {
            return <div>Доступ запрещён</div>;
        }
        if (userRoles !== 'admin') {
            const client: Client = new Client({
                brokerURL: 'ws://localhost:8084/ws', // endpoint из конфигурации
                reconnectDelay: 5000,
            });
            const tokenId: TokenId = parseJwt(getIdToken())
            client.onConnect = (): void => {
                startSharingLocation(tokenId, client)
                console.log('WebSocket подключен');
            };
            client.activate()
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
                    <Route path="users" element={<UsersTab/>}/>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound role={getRole()}/>}/>
            </Routes>
            <InfoSection/>
        </BrowserRouter>
    )
}

export default App;
