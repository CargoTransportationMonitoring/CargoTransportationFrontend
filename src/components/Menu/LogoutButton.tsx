import React, {JSX} from "react";
import {CLIENT_ID, CLIENT_ROOT_URI, KEYCLOAK_URI} from "../../util/Constants";

const LogoutButton: React.FC = (): JSX.Element => {

    const clearLocalStorage = (): void => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('originalState');
        localStorage.removeItem('originalCodeVerifier');
        localStorage.removeItem('state');
    }

    const handleLogout = (): void => {
        console.log('Logout')
        let logoutUrl: string = KEYCLOAK_URI + '/logout';
        logoutUrl += '?post_logout_redirect_uri=' + CLIENT_ROOT_URI;
        logoutUrl += '&id_token_hint=' + localStorage.getItem('id_token');
        logoutUrl += '&client_id=' + CLIENT_ID;

        window.open(logoutUrl, '_self');
        clearLocalStorage()
    }


    return (
        <>
            <button onClick={handleLogout}>Logout</button>
        </>
    )
}

export default LogoutButton