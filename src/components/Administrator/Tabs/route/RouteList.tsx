import React, {JSX, useEffect, useState} from "react";
import RouteItem from "./RouteItem";
import axios, {AxiosResponse} from "axios";
import {API_V1_ROUTE_PREFIX, SERVER_ROUTE_URI} from "../../../../util/Constants";
import {getToken} from "../../../auth/KeycloakService";
import {useDispatch, useSelector} from "react-redux";
import {RouteType, selectRoutes, setRoutes} from "../../../../redux/slices/RouteSlice";
import {Dispatch} from "@reduxjs/toolkit";
import {setError} from "../../../../redux/slices/ErrorSlice";
import {isAdmin, parseJwt} from "../../../../util/KeycloakUtils";
import {FilterType} from "../../../../redux/slices/FilterSlice";
import RouteWindow from "./window/RouteWindow";

const RouteList: React.FC<{
    filter?: FilterType
}> = ({filter}): JSX.Element => {

    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [activeRouteId, setActiveRouteId] = useState<string | undefined>(undefined);
    const routes: RouteType[] = useSelector(selectRoutes)
    const dispatch: Dispatch = useDispatch()

    const handleViewRouteClick = (routeId: string): void => {
        setActiveRouteId(routeId)
        openModal()
    }

    const openModal = (): void => {
        setModalOpen(true);
    };

    const closeModal = (): void => {
        setModalOpen(false);
    }

    useEffect((): void => {
        let additionalParams: string = ''

        if (filter?.username) {
            additionalParams = `username=${filter.username}`
        }

        const serverUri: string = isAdmin()
            ? `${SERVER_ROUTE_URI}/${API_V1_ROUTE_PREFIX}?${additionalParams}`
            : `${SERVER_ROUTE_URI}/${API_V1_ROUTE_PREFIX}/user/${parseJwt(getToken()).sub}`

        axios.get(serverUri, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        }).then((response: AxiosResponse): void => {
            const routeIds: number[] = response.data.content
            const routes: RouteType[] = routeIds.map((routeId: number): RouteType => ({
                routeId: routeId.toString()
            }))
            dispatch(setRoutes(routes))
        }).catch((error): void => {
            dispatch(setError(error))
        })
    }, [filter])

    return (
        <>
            <div>
                {
                    routes.map((route: RouteType) => (
                        <RouteItem key={route.routeId}
                                   routeId={route.routeId}
                                   handleClick={handleViewRouteClick}
                        />
                    ))
                }
            </div>
            {isModalOpen && (
                <RouteWindow
                    onCancel={closeModal}
                    routeId={activeRouteId}
                />
            )}
        </>

    )
}

export default RouteList;