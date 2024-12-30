import React, {JSX} from "react";
import {Outlet} from "react-router-dom";
import Menu from "./Menu";

const MainLayout: React.FC = (): JSX.Element => {
    return (
        <>
            <Menu/>
            <Outlet/>
        </>
    )
}

export default MainLayout;