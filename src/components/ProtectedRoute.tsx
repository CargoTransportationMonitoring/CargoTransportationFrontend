import React, {JSX} from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    isAuthorized: boolean
    children: JSX.Element
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthorized, children }: ProtectedRouteProps) => {
    if (!isAuthorized) {
        return <Navigate to="/" replace />
    }
    return children;
};

export default ProtectedRoute;
