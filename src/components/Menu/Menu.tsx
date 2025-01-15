import React, {JSX} from "react";
import {NavLink} from "react-router-dom";
import LogoutButton from "./LogoutButton";
import {isAdmin} from "../../util/KeycloakUtils";

const Menu: React.FC = (): JSX.Element => {
    return (
        <nav>
            <NavLink to='profile' end>Profile</NavLink>
            <NavLink to='cargos'>Cargos</NavLink>
            <NavLink to='routes'>Routes</NavLink>
            {isAdmin() && <NavLink to='users'>Users</NavLink>}
            <LogoutButton/>
        </nav>
    )
}

export default Menu;