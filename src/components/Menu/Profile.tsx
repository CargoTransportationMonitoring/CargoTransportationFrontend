import React, {JSX, useEffect} from "react";
import {getIdToken, getKeycloakInstance} from "../auth/KeycloakService";
import Keycloak from "keycloak-js";

const Profile: React.FC = (): JSX.Element => {

    const parseJwt = (token: string) => {
        const base64Url: string = token.split('.')[1];
        const base64: string = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload: string = decodeURIComponent(window.atob(base64).split('').map(
            (c: string): string => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));

        return JSON.parse(jsonPayload);
    }

    return (
        <div>
            <h1>Email: {parseJwt(getIdToken())['email']}</h1>
            <h1>Preferred name: {parseJwt(getIdToken())['preferred_username']}</h1>
        </div>
    )
}

export default Profile;