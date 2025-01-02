import React, {JSX} from "react";
import styles from './CreateRouteWindow.module.css'
import MapComponent from "../../../Map/MapComponent";
import {setError} from "../../../../redux/slices/ErrorSlice";
import axios, {AxiosResponse} from "axios";
import {Geolocation} from "../../../../hooks/useGeolocation";
import {getToken} from "../../../auth/KeycloakService";
import {API_V1_ROUTE_PREFIX, SERVER_ROUTE_URI} from "../../../../util/Constants";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {addRoute, removeRoute} from "../../../../redux/slices/RouteSlice";


type routeType = {
    coordinates: Geolocation[]
}

const RouteWindow: React.FC<{
    onCancel: () => void
    routeId: string | null
}> = ({onCancel, routeId}): JSX.Element => {

    const markersArray: Array<Geolocation> = new Array<Geolocation>();
    const dispatch: Dispatch = useDispatch()

    const handleCreate = (): void => {
        if (markersArray.length === 0) {
            setError('Отметьте хотя бы одну точку на карте');
            return;
        }

        console.log(markersArray)

        const requestBody: routeType = {
            coordinates: markersArray.map((marker: Geolocation): Geolocation => ({
                latitude: marker.latitude,
                longitude: marker.longitude,
            })),
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
                console.log('Route created', response.data);
            })
            .catch((error): void => {
                if (error.response) {
                    if (error.response.status === 400) {
                        setError('Ошибка валидации данных');
                    } else if (error.response.status === 403) {
                        setError('Недостаточно прав для выполнения операции');
                    } else {
                        setError('Неизвестная ошибка');
                    }
                } else {
                    console.error('Ошибка сети или сервера:', error.message);
                    setError('Ошибка сети, попробуйте снова');
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
                console.log('Route deleted', response.data);
            })
        } catch (error) {
            console.log(error)
        } finally {
            onCancel()
        }
    }

    const handleUpdate = (): void => {
        console.log('updated')
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>Создать маршрут</h2>
                <MapComponent markersArray={markersArray} routeId={routeId}/>
                <p>Вы уверены, что хотите создать маршрут?</p>
                <div className={styles.buttons}>
                    {routeId ?
                        <>
                            <button onClick={handleUpdate} className={styles.button}>Update</button>
                            <button onClick={handleDelete} className={styles.button}>Delete</button>
                        </>
                        : <button onClick={handleCreate} className={styles.button}>Create</button>
                    }
                    <button onClick={onCancel} className={styles.button}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default RouteWindow