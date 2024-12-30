import React, {JSX} from "react";
import {NavLink} from "react-router-dom";
import Profile from "./Profile";
import LogoutButton from "./LogoutButton";

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