import React, {JSX, useEffect} from "react";
import RouteItem from "./RouteItem";
import axios, {AxiosResponse} from "axios";
import {API_V1_ROUTE_PREFIX, SERVER_ROUTE_URI} from "../../../../util/Constants";
import {getIdToken, getToken} from "../../../auth/KeycloakService";
import {useDispatch, useSelector} from "react-redux";
import {addRoute, RouteType, selectRoutes} from "../../../../redux/slices/RouteSlice";
import {Dispatch} from "@reduxjs/toolkit";
import {setError} from "../../../../redux/slices/ErrorSlice";
import {isAdmin, parseJwt} from "../../../../util/KeycloakUtils";

const RouteList: React.FC<{
    handleClick: (routeId: string) => void
}> = ({handleClick}): JSX.Element => {

    const routes: RouteType[] = useSelector(selectRoutes)
    const dispatch: Dispatch = useDispatch()


    useEffect((): void => {

        const serverUri: string = isAdmin()
            ? `${SERVER_ROUTE_URI}/${API_V1_ROUTE_PREFIX}`
            : `${SERVER_ROUTE_URI}/${API_V1_ROUTE_PREFIX}/user/${parseJwt(getToken()).sub}`

        axios.get(serverUri, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        }).then((response: AxiosResponse): void => {
            const routes: RouteType[] = response.data.content;
            routes.forEach((route: RouteType): void => {
                dispatch(addRoute({
                    routeId: route
                }))
            });
        }).catch((error): void => {
            dispatch(setError(error))
        })
    }, [])

    return (
        <div>
            {
                routes.map((route: RouteType) => (
                    <RouteItem key={route.routeId}
                               routeId={route.routeId}
                               handleClick={handleClick}
                    />
                ))
            }
        </div>
    )
}

export default RouteList;