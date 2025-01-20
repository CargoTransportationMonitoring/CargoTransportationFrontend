import React, {FC, JSX} from "react";
import {Location, useLocation} from "react-router-dom";
import RouteList from "../route/RouteList";
import {FilterType, selectFilter} from "../../../../redux/slices/FilterSlice";
import {useSelector} from "react-redux";

const UserDetails: FC = (): JSX.Element => {
    const location: Location<any> = useLocation();
    const { username } = location.state || {}
    const filter: FilterType = useSelector(selectFilter);

    return (
        <>
            <h1>Username: {username}</h1>
            <RouteList filter={filter}/>
        </>
    )
}

export default UserDetails