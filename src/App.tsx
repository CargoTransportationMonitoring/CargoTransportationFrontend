import './App.css';
import React, {JSX, useEffect, useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AuthForm from "./components/AuthForm";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPage from "./components/Administrator/AdminPage";
import CargoCarrierPage from "./components/СargoСarrier/CargoCarrierPage";

const App: React.FC = (): JSX.Element => {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [role, setRole] = useState<string | null>(null);

    // Симуляция проверки токена
    useEffect((): void => {
        const token: string | null = localStorage.getItem('token');
        const userRole: string | null = localStorage.getItem('role'); // "carrier" или "admin"

        if (token) {
            setIsAuthorized(true);
            setRole(userRole);
        } else {
            setIsAuthorized(false);
        }
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                {/* Страница авторизации */}
                <Route path="/" element={<AuthForm/>}/>

                {/* Защищённая страница для перевозчика */}
                <Route
                    path="/main"
                    element={
                        <ProtectedRoute isAuthorized={isAuthorized && role === 'carrier'}>
                            <CargoCarrierPage/>
                        </ProtectedRoute>
                    }
                />

                {/* Защищённая страница для администратора */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute isAuthorized={isAuthorized && role === 'admin'}>
                            <AdminPage/>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
