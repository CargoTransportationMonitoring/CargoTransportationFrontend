import {Outlet} from "react-router-dom";
import {JSX} from "react";
import Menu from "./Menu";

const MainLayout = (): JSX.Element => {
    return (
        <>
            <Menu/>
            <Outlet/>
        </>
    )
}

export default MainLayout;