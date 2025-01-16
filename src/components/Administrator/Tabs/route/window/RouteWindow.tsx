import React, {JSX, useEffect, useState} from "react";
import styles from './CreateRouteWindow.module.css'
import MapComponent from "../../../../Map/MapComponent";
import {setError} from "../../../../../redux/slices/ErrorSlice";
import axios, {AxiosResponse} from "axios";
import {Geolocation} from "../../../../../hooks/useGeolocation";
import {getToken} from "../../../../auth/KeycloakService";
import {API_V1_ROUTE_PREFIX, SERVER_ROUTE_URI} from "../../../../../util/Constants";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {addRoute, removeRoute} from "../../../../../redux/slices/RouteSlice";
import RouteForm from "./RouteForm";
import {isAdmin} from "../../../../../util/KeycloakUtils";


type routeType = {
    name: string,
    description: string,
    assignedUsername: string,
    coordinates: Geolocation[]
}

const RouteWindow: React.FC<{
    onCancel: () => void,
    routeId: string | null
}> = ({onCancel, routeId}): JSX.Element => {

    const [markersArray, setMarkersArray] = useState<Geolocation[]>([])
    const dispatch: Dispatch = useDispatch()
    const [routeName, setRouteName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [assignedUser, setAssignedUser] = useState<string>('');

    const handleCreate = (): void => {
        if (markersArray.length === 0) {
            dispatch(setError('Отметьте хотя бы одну точку на карте'));
            return;
        }

        const requestBody: routeType = {
            coordinates: markersArray.map((marker: Geolocation): Geolocation => ({
                latitude: marker.latitude,
                longitude: marker.longitude,
            })),
            name: routeName,
            description: description,
            assignedUsername: assignedUser
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
        try {
            axios.delete(`${SERVER_ROUTE_URI}/${API_V1_ROUTE_PREFIX}/${routeId}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            }).then((response: AxiosResponse): void => {
                dispatch(removeRoute({
                    routeId: routeId
                }))
            })
        } catch (error) {
            dispatch(setError(error))
        } finally {
            onCancel()
        }
    }

    const handleUpdate = (): void => {
        if (markersArray.length === 0) {
            dispatch(setError('Отметьте хотя бы одну точку на карте'));
            return;
        }
        markersArray.forEach((marker: Geolocation) => console.log(marker))

        const requestBody: routeType = {
            coordinates: markersArray.map((marker: Geolocation): Geolocation => ({
                latitude: marker.latitude,
                longitude: marker.longitude,
            })),
            name: routeName,
            description: description,
            assignedUsername: assignedUser
        };


        axios.put(`${SERVER_ROUTE_URI}/${API_V1_ROUTE_PREFIX}/${routeId}`, requestBody, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            }
        }).then((response: AxiosResponse): void => {
            console.log(response)
        }).catch((error): void => {
            dispatch(setError(`Ошибка обновления маршрута: ${error}`))
        }).finally((): void => {
            onCancel();
        });
    }

    const handleUpdatePoints = (): void => {
        markersArray.forEach((marker: Geolocation) => console.log(marker))
        axios.put(`${SERVER_ROUTE_URI}/${API_V1_ROUTE_PREFIX}/markPoints/${routeId}`, markersArray, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            }
        }).then((response: AxiosResponse): void => {
            console.log(response)
        }).catch((error): void => {
            dispatch(setError(`Ошибка обновления маршрута: ${error}`))
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
            }).catch((error): void => {
                dispatch(setError(error))
            })
        }
    }, [])

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                {!!routeId ? <h2>Просмотр и редактирование маршрута</h2> : <h2>Создание маршрута</h2>}
                <RouteForm
                    routeName={routeName}
                    description={description}
                    assignedUser={assignedUser}
                    setRouteName={setRouteName}
                    setDescription={setDescription}
                    setAssignedUser={setAssignedUser}
                />
                <MapComponent markersArray={markersArray} setMarkersArray={setMarkersArray} routeId={routeId}/>
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
                            <button onClick={handleUpdatePoints} className={styles.button}>Update points</button>
                        )
                    )}
                    <button onClick={onCancel} className={styles.button}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default RouteWindow