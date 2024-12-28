import './App.css';
import React, {JSX} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AuthForm from "./components/auth/AuthForm";
import Error from "./components/Error/Error";
import CarrierProfileTab from "./components/СargoСarrier/Tabs/CarrierProfileTab";
import CarrierCargoTab from "./components/СargoСarrier/Tabs/CarrierCargoTab";
import CarrierRouteTab from "./components/СargoСarrier/Tabs/CarrierRouteTab";
import AdminProfileTab from "./components/Administrator/Tabs/AdminProfileTab";
import AdminCargoTab from "./components/Administrator/Tabs/AdminCargoTab";
import AdminRouteTab from "./components/Administrator/Tabs/AdminRouteTab";
import NotFound from "./components/NotFound/NotFound";
import MainLayout from "./components/Menu/MainLayout";
import OAuthRedirectHandler from "./components/auth/OAuthRedirectHandler";

const App: React.FC = (): JSX.Element => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth" element={<AuthForm/>}/>
                <Route path="/redirect" element={<OAuthRedirectHandler/>}/>
                {/* Защищённая страница для перевозчика */}
                <Route
                    path="/main"
                    element={<MainLayout/>}
                >
                    {/* Вкладки для перевозчика */}
                    <Route path="profile" element={<CarrierProfileTab/>}/>
                    <Route path="cargos" element={<CarrierCargoTab/>}/>
                    <Route path="routes" element={<CarrierRouteTab/>}/>
                </Route>

                {/* Защищённая страница для администратора */}
                <Route
                    path="/admin"
                    element={<MainLayout/>}
                >
                    {/* Вкладки для администратора */}
                    <Route path="profile" element={<AdminProfileTab/>}/>
                    <Route path="cargos" element={<AdminCargoTab/>}/>
                    <Route path="routes" element={<AdminRouteTab/>}/>
                </Route>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
            <Error/>
        </BrowserRouter>
    );
};

export default App;
