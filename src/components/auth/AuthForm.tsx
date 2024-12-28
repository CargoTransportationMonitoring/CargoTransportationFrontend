import React, {JSX, useState} from "react";
import {generateCodeChallenge, generateCodeVerifier, generateRandomState} from "../../util/KeycloakUtils";
import axios from "axios";
import {
    AUTH_CODE_REDIRECT_URI,
    CLIENT_ID, CODE_CHALLENGE_METHOD,
    KEYCLOAK_URI,
    RESOURCE_SERVER_ADMIN_URI,
    RESPONSE_TYPE,
    SCOPE
} from "../../util/Constants";

const AuthForm: React.FC = (): JSX.Element => {

    const [formType, setFormType] = useState<'signin' | 'signup' | null>(null);

    const requestDataFromResourceServer = async (): Promise<void> => {
        await axios.get(RESOURCE_SERVER_ADMIN_URI, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(
            response => {
                console.log('Response:', response.data);
            }
        ).catch(error => {
            console.error('Error:', error);
        })
    }

    const requestAuthorizationCode = async (state: string, codeChallenge: string, codeVerifier: string): Promise<void> => {
        let authUrl: string = KEYCLOAK_URI + '/auth';

        authUrl += '?response_type=' + RESPONSE_TYPE;
        authUrl += '&client_id=' + CLIENT_ID;
        authUrl += '&state=' + state;
        authUrl += '&scope=' + SCOPE;
        authUrl += '&redirect_uri=' + AUTH_CODE_REDIRECT_URI;
        authUrl += '&code_challenge=' + codeChallenge;
        authUrl += '&code_challenge_method=' + CODE_CHALLENGE_METHOD;

        localStorage.setItem('originalState', state)
        localStorage.setItem('originalCodeVerifier', codeVerifier)

        window.open(authUrl, '_self');
    }

    return (
        <>
            {!formType && (
                <div>
                    <button onClick={async (): Promise<void> => {
                        const codeVerifier: string = generateCodeVerifier();
                        const codeChallenge: string = await generateCodeChallenge(codeVerifier);
                        await requestAuthorizationCode(generateRandomState(), codeChallenge, codeVerifier);
                    }}>
                        Sign In
                    </button>
                    <button onClick={() => setFormType('signup')}>Sign Up</button>
                    <button onClick={() => requestDataFromResourceServer()}>Rs data</button>
                </div>
            )}

            {}
        </>
    );
}

export default AuthForm