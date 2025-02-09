import React, {JSX, useEffect, useState} from "react";
import styles from './CreateRouteWindow.module.css'
import MapComponent from "../../../../Map/MapComponent";
import {setError, setInfo} from "../../../../../redux/slices/InfoTabSlice";
import axios, {AxiosResponse} from "axios";
import {getToken} from "../../../../../util/KeycloakService";
import {API_V1_ROUTE_PREFIX, SERVER_ROUTE_URI} from "../../../../../util/Constants";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {addRoute, removeRoute} from "../../../../../redux/slices/RouteSlice";
import {Geolocation} from "../../../../Map/MapComponent";
import RouteAdminForm from "./RouteAdminForm";
import {isAdmin} from "../../../../../util/KeycloakUtils";
import RouteCarrierForm from "../../../../СargoСarrier/Tabs/route/RouteCarrierForm";


type RouteType = {
    name: string,
    description: string,
    assignedUsername: string,
    coordinates: Geolocation[],
    routeStatus: "NEW" | "IN_PROGRESS" | "COMPLETED"
}

type UpdateStatusAndPointsType = {
    coordinates: Geolocation[],
    routeStatus: "NEW" | "IN_PROGRESS" | "COMPLETED"
}

const RouteWindow: React.FC<{
    onCancel: () => void,
    routeId?: string | undefined
}> = ({onCancel, routeId}): JSX.Element => {

    const [markersArray, setMarkersArray] = useState<Geolocation[]>([])
    const dispatch: Dispatch = useDispatch()
    const [routeName, setRouteName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [assignedUser, setAssignedUser] = useState<string>('');
    const [routeStatus, setRouteStatus] = useState<"NEW" | "IN_PROGRESS" | "COMPLETED">("NEW")


    const handleCreate = (): void => {
        if (markersArray.length === 0) {
            dispatch(setError('Отметьте хотя бы одну точку на карте'));
            return;
        }

        const requestBody: RouteType = {
            coordinates: markersArray.map((marker: Geolocation): Geolocation => ({
                latitude: marker.latitude,
                longitude: marker.longitude,
            })),
            name: routeName,
            description: description,
            assignedUsername: assignedUser,
            routeStatus: "NEW"
        };

        axios
            .post(`${SERVER_ROUTE_URI}/${API_V1_ROUTE_PREFIX}`, requestBody, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            })
            .then((response: AxiosResponse): void => {
                dispatch(addRoute({
                    routeId: response.data.id
                }))
            })
            .catch((error): void => {
                if (error.response) {
                    if (error.response.status === 400) {
                        dispatch(setError('Ошибка валидации данных'));
                    } else if (error.response.status === 403) {
                        dispatch(setError('Недостаточно прав для выполнения операции'));
                    } else {
                        dispatch(setError('Неизвестная ошибка'));
                    }
                } else {
                    dispatch(setError('Ошибка сети, попробуйте снова'));
                }
            })
            .finally((): void => {
                onCancel();
            });
    };

    const handleDelete = (): void => {
        axios.delete(`${SERVER_ROUTE_URI}/${API_V1_ROUTE_PREFIX}/${routeId}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
        }).then((response: AxiosResponse): void => {
            dispatch(removeRoute({
                routeId: routeId
            }))
            dispatch(setInfo('Маршрут успешно удален'))
        }).catch((error): void => {
            if (error.response && error.response.data && error.response.data.error) {
                dispatch(setError(`Ошибка удаления маршрута: ${error.response.data.error}`));
            } else {
                dispatch(setError(`Ошибка удаления маршрута: ${error.message}`));
            }
        }).finally((): void => {
            onCancel()
        })
    }

    const handleUpdate = (): void => {
        if (markersArray.length === 0) {
            dispatch(setError('Отметьте хотя бы одну точку на карте'));
            return;
        }
        markersArray.forEach((marker: Geolocation) => console.log(marker))

        const requestBody: RouteType = {
            coordinates: markersArray.map((marker: Geolocation): Geolocation => ({
                latitude: marker.latitude,
                longitude: marker.longitude,
            })),
            name: routeName,
            description: description,
            assignedUsername: assignedUser,
            routeStatus: routeStatus
        };


        axios.put(`${SERVER_ROUTE_URI}/${API_V1_ROUTE_PREFIX}/${routeId}`, requestBody, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            }
        }).then((response: AxiosResponse): void => {
            dispatch(setInfo('Маршрут успешно обновлен'));
        }).catch((error): void => {
            if (error.response && error.response.data && error.response.data.error) {
                dispatch(setError(`Ошибка обновления маршрута: ${error.response.data.error}`));
            } else {
                dispatch(setError(`Ошибка обновления маршрута: ${error.message}`));
            }
        }).finally((): void => {
            onCancel();
        });
    }

    const handleUpdateProgression = (): void => {
        markersArray.forEach((marker: Geolocation) => console.log(marker))
        const requestBody: UpdateStatusAndPointsType = {
            coordinates: markersArray,
            routeStatus: routeStatus
        }
        axios.put(`${SERVER_ROUTE_URI}/${API_V1_ROUTE_PREFIX}/markPoints/${routeId}`, requestBody, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            }
        }).then((response: AxiosResponse): void => {
            dispatch(setInfo('Маршрут успешно обновлен'))
        }).catch((error): void => {
            if (error.response && error.response.data && error.response.data.error) {
                dispatch(setError(`Ошибка обновления маршрута: ${error.response.data.error}`));
            } else {
                dispatch(setError(`Ошибка обновления маршрута: ${error.message}`));
            }
        }).finally((): void => {
            onCancel()
        })
    }

    useEffect((): void => {
        if (routeId) {
            axios.get(`${SERVER_ROUTE_URI}/${API_V1_ROUTE_PREFIX}/${routeId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }).then((response: AxiosResponse): void => {
                console.log(response.data)
                setMarkersArray(response.data.coordinates);
                setRouteName(response.data.name);
                setDescription(response.data.description);
                setAssignedUser(response.data.assignedUsername);
                setRouteStatus(response.data.routeStatus);
            }).catch((error): void => {
                dispatch(setError(error))
            })
        }
    }, [])

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                {!!routeId ? <h2>Просмотр и редактирование маршрута</h2> : <h2>Создание маршрута</h2>}
                {isAdmin() ? <RouteAdminForm
                    routeName={routeName}
                    description={description}
                    assignedUser={assignedUser}
                    routeStatus={routeStatus}
                    setRouteName={setRouteName}
                    setDescription={setDescription}
                    setAssignedUser={setAssignedUser}
                /> : <RouteCarrierForm
                    routeName={routeName}
                    description={description}
                    assignedUser={assignedUser}
                    routeStatus={routeStatus}
                    setRouteStatus={setRouteStatus}
                />
                }
                <MapComponent markersArray={markersArray} setMarkersArray={setMarkersArray}/>
                {!routeId && <p>Вы уверены, что хотите создать маршрут?</p>}
                <div className={styles.buttons}>
                    {routeId && isAdmin() ? (
                        <>
                            <button onClick={handleUpdate} className={styles.button}>Update</button>
                            <button onClick={handleDelete} className={styles.button}>Delete</button>
                        </>
                    ) : (
                        isAdmin() ? (
                            <button onClick={handleCreate} className={styles.button}>Create</button>
                        ) : (
                            <button onClick={handleUpdateProgression} className={styles.button}>Update</button>
                        )
                    )}
                    <button onClick={onCancel} className={styles.button}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default RouteWindow