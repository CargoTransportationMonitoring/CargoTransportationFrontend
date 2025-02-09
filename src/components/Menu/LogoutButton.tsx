import React, {JSX} from "react";
import {getIdToken} from "../../util/KeycloakService";
import {CLIENT_ROOT_URI, KEYCLOAK_CLIENT_ID, KEYCLOAK_URI} from "../../util/Constants";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {setInfo} from "../../redux/slices/InfoTabSlice";

const LogoutButton: React.FC = (): JSX.Element => {

    const dispatch: Dispatch = useDispatch()

    const handleLogout = (): void => {
        dispatch(setInfo('Logout successful'))
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