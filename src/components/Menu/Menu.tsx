import React, {JSX} from "react";
import {NavLink} from "react-router-dom";
import LogoutButton from "./LogoutButton";
import Profile from "./Profile";

const Menu: React.FC = (): JSX.Element => {
    return (
        <nav>
            <NavLink to='profile' end>Profile</NavLink>
            <NavLink to='cargos'>Cargos</NavLink>
            <NavLink to='routes'>Routes</NavLink>
            <Profile/>
            <LogoutButton/>
        </nav>
    )
}

export default Menu;