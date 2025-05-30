import React, {JSX, useEffect, useState} from "react";
import RouteItem from "./RouteItem";
import axios, {AxiosResponse} from "axios";
import {API_V1_ROUTE_PREFIX, API_V1_USER_PREFIX, SERVER_ROUTE_URI} from "../../../../util/Constants";
import {getToken} from "../../../../util/KeycloakService";
import {useDispatch, useSelector} from "react-redux";
import {RouteType, selectRoutes, setRoutes} from "../../../../redux/slices/RouteSlice";
import {Dispatch} from "@reduxjs/toolkit";
import {setError} from "../../../../redux/slices/InfoTabSlice";
import {isAdmin, parseJwt} from "../../../../util/KeycloakUtils";
import {FilterType} from "../../../../redux/slices/FilterSlice";
import RouteWindow from "./window/RouteWindow";
import StatusTabs from "../StatusTabs";
import styles from "./RouteList.module.css"

type ResponseItemType = {
    id: number,
    name: string,
    description: string,
    assignedUsername: string,
    routeStatus: "NEW" | "IN_PROGRESS" | "COMPLETED",
    pointsCount: number
}

const RouteList: React.FC<{
    filter?: FilterType
    setCreateModalOpen: (isModalOpen: boolean) => void
}> = ({filter, setCreateModalOpen}): JSX.Element => {

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
    }

    const closeModal = (): void => {
        setModalOpen(false);
    }

    useEffect((): void => {
        let additionalParams: string = ''
        let statusParameter: string = 'NEW'
        console.log(filter)
        if (filter?.username) {
            additionalParams = `username=${filter.username}`
        }
        if (filter?.pointsNumberFrom) {
            additionalParams = `${additionalParams}&pointsNumberFrom=${filter.pointsNumberFrom}`
        }
        if (filter?.pointsNumberTo) {
            additionalParams = `${additionalParams}&pointsNumberTo=${filter.pointsNumberTo}`
        }
        if (filter?.description) {
            additionalParams = `${additionalParams}&description=${filter.description}`
        }
        if (filter?.name) {
            additionalParams = `routeName=${filter.name}`
        }

        if (filter?.routeStatus) {
            statusParameter = filter.routeStatus
        }
        additionalParams = `${additionalParams}&routeStatus=${statusParameter}`

        const serverUri: string = isAdmin()
            ? `${SERVER_ROUTE_URI}/${API_V1_ROUTE_PREFIX}?${additionalParams}`
            : `${SERVER_ROUTE_URI}/${API_V1_USER_PREFIX}/${parseJwt(getToken()).sub}/routes?${additionalParams}`

        axios.get(serverUri, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        }).then((response: AxiosResponse): void => {
            const routes: RouteType[] = response.data.content.map((responseItem: ResponseItemType): RouteType => ({
                id: responseItem.id.toString(),
                name: responseItem.name,
                description: responseItem.description,
                assignedUsername: responseItem.assignedUsername,
                routeStatus: responseItem.routeStatus,
                pointsCount: responseItem.pointsCount
            }))
            dispatch(setRoutes(routes))
        }).catch((error): void => {
            dispatch(setError(error))
        })
    }, [filter])

    return (
        <>
            <StatusTabs setCreateModalOpen={setCreateModalOpen}/>
            <div className={styles.tableWrapper}>
                <table className={styles.routesTable}>
                    <thead>
                    <tr>
                        <th>Идентификатор</th>
                        <th>Наименование</th>
                        <th>Описание</th>
                        <th>Грузоперевозчик</th>
                        <th>Количество точек</th>
                        <th>Действие</th>
                    </tr>
                    </thead>
                    <tbody>
                    {routes.map((route: RouteType) => (
                        <RouteItem
                            key={route.id}
                            route={route}
                            handleClick={handleViewRouteClick}
                        />
                    ))}
                    </tbody>
                </table>
                {isModalOpen && (
                    <RouteWindow
                        onCancel={closeModal}
                        routeId={activeRouteId}
                    />
                )}
            </div>
        </>
    )
}

export default RouteList;