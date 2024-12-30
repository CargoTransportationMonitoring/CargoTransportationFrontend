import React, {JSX} from "react";
import {getIdToken} from "../auth/KeycloakService";
import {CLIENT_ROOT_URI, KEYCLOAK_CLIENT_ID, KEYCLOAK_URI} from "../../util/Constants";

const LogoutButton: React.FC = (): JSX.Element => {

    const handleLogout = (): void => {
        console.log('Logout')
        let logoutUrl: string = KEYCLOAK_URI + '/logout';
        logoutUrl += '?post_logout_redirect_uri=' + CLIENT_ROOT_URI;
        logoutUrl += '&id_token_hint=' + getIdToken();
        logoutUrl += '&client_id=' + KEYCLOAK_CLIENT_ID;

        window.location.href = logoutUrl
        localStorage.clear()
    }


    return (
        <button onClick={handleLogout}>Logout</button>
    )
}

export default LogoutButton