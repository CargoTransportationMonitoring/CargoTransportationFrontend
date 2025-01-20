import React, {JSX} from "react";
import {parseJwt, TokenId} from "../../../util/KeycloakUtils";
import {getIdToken} from "../../auth/KeycloakService";

const AdminProfileTab: React.FC = (): JSX.Element => {

    const tokenData: TokenId = parseJwt(getIdToken());

    return (
        <div>
            <h2>Email: {tokenData.email}</h2>
            <label>First name:</label>
            <h2 id="firstName">{tokenData.given_name}</h2>
            <label htmlFor="lastName">Last name:</label>
            <h2 id="lastName">{tokenData.family_name}</h2>
        </div>
    )
}

export default AdminProfileTab