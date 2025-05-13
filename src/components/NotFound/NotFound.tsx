import React, {JSX} from "react";
import {NavLink} from "react-router-dom";

interface NotFoundProps {
    role: string
}

const NotFound: React.FC<NotFoundProps> = ({role}: NotFoundProps): JSX.Element => {

    return (
        <div className="not-found-container">
            <h1 className="not-found-title">404</h1>
            <p className="not-found-text">Oops! Page Not Found.</p>
            <NavLink
                to={role === 'admin' ? '/admin/profile' : '/main/profile'}
                className="not-found-button"
            >
                Go to Main Page
            </NavLink>
        </div>
    );
}

export default NotFound