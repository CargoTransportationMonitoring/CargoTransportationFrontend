import React, {JSX, useEffect} from 'react';
import {Location, NavigateFunction, useLocation, useNavigate} from 'react-router-dom';
import axios from "axios";
import {
    ACCESS_TOKEN_REDIRECT_URI,
    CLIENT_ID,
    GRANT_TYPE_AUTHORIZATION_CODE,
    KEYCLOAK_URI
} from "../../util/Constants";

const OAuthRedirectHandler: React.FC = (): JSX.Element => {
    const location: Location = useLocation();
    const navigate: NavigateFunction = useNavigate();

    const requestToken = async (stateFromAuthServer: string, authCode: string): Promise<void> => {
        const originalState: string | null = localStorage.getItem("originalState")
        const originalCodeVerifier: string | null = localStorage.getItem("originalCodeVerifier")
        if (stateFromAuthServer === originalState) {
            console.log('State is correct:', stateFromAuthServer, originalState);

            const data = {
                "grant_type": GRANT_TYPE_AUTHORIZATION_CODE,
                "client_id": CLIENT_ID,
                "code": authCode,
                "code_verifier": originalCodeVerifier,
                "redirect_uri": ACCESS_TOKEN_REDIRECT_URI
            }
            await axios.post(KEYCLOAK_URI + '/token', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(response => {
                console.log('Response:', response.data);
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('refresh_token', response.data.refresh_token);
                localStorage.setItem('id_token', response.data.id_token)
                navigate('/main')
            }).catch(error => {
                // if (!(error.response.status === 403 || error.response.status === 401)) {
                //     return
                // }
                console.error('Error:', error);
                // const refreshToken: string | null = localStorage.getItem('refresh_token')
                //
                // if (refreshToken) {
                //     changeRefreshTokenToAccessToken(refreshToken)
                // }
            })

        } else {
            console.log('State is incorrect:', stateFromAuthServer, originalState);
        }
    }

    useEffect((): void => {
        const queryParams: URLSearchParams = new URLSearchParams(location.search);
        const code: string | null = queryParams.get('code');
        const state: string | null = queryParams.get('state');

        if (code && state) {
            requestToken(state, code).then(() => console.log('token requested'))
        } else {
            console.error('Authorization failed or no opener window.');
        }
    }, [location, navigate]);

    return <div>Processing authentication...</div>;
};

export default OAuthRedirectHandler;
