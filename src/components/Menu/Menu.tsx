import React, {JSX} from "react";
import {NavLink} from "react-router-dom";
import LogoutButton from "./LogoutButton";
import styles from "./Menu.module.css"
import {isAdmin} from "../../util/KeycloakUtils";

const Menu: React.FC = (): JSX.Element => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.navLinks}>
                <NavLink to='profile' end className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                    Профиль
                </NavLink>
                <NavLink to='routes' className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                    Маршруты
                </NavLink>
                {isAdmin() && <NavLink to='users' className={({ isActive }) => isActive ? styles.activeLink : styles.link}>
                    Грузоперевозчики
                </NavLink>}
            </div>
            <LogoutButton/>
        </nav>
    )
}

export default Menu;