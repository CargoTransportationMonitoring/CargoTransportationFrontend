import React, {FC, JSX} from "react";
import {Location, useLocation} from "react-router-dom";
import RouteList from "../route/RouteList";

const UserDetails: FC = (): JSX.Element => {
    const location: Location<any> = useLocation();
    const { username } = location.state || {}

    return (
        <>
            <h1>Username: {username}</h1>
            <RouteList filter={{
                username: username
            }}/>
        </>
    )
}

export default UserDetails