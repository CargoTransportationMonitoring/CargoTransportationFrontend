import React, {JSX} from "react";
import {NavLink} from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Menu: React.FC = (): JSX.Element => {
    return (
        <nav>
            <NavLink to='profile' end>Profile</NavLink>
            <NavLink to='routes'>Routes</NavLink>
            <LogoutButton/>
        </nav>
    )
}

export default Menu;