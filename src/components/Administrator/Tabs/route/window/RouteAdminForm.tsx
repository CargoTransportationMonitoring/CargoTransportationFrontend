import React, {JSX, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {SERVER_CORE_URI} from "../../../../../util/Constants";
import {getToken} from "../../../../../util/KeycloakService";
import {setError} from "../../../../../redux/slices/InfoTabSlice";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {UserType} from "../../../../Menu/filter/FilterByFields";
import {ROUTE_STATUS_MAP} from "../../StatusTabs";

const RouteAdminForm: React.FC<{
    routeName: string,
    description: string,
    assignedUser: string,
    routeStatus?: "NEW" | "IN_PROGRESS" | "COMPLETED"
    setRouteName: (routeName: string) => void,
    setDescription: (description: string) => void,
    setAssignedUser: (assignedUser: string) => void
}> = ({
          routeName,
          description,
          assignedUser,
          routeStatus,
          setRouteName,
          setDescription,
          setAssignedUser
      }): JSX.Element => {

    const [users, setUsers] = useState<UserType[]>([]);
    const dispatch: Dispatch = useDispatch();

    useEffect((): void => {
        axios.get(`${SERVER_CORE_URI}/api/v1/users`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            }
        }).then((response: AxiosResponse): void => {
            setUsers(response.data);
        }).catch((error): void => {
            dispatch(setError(error));
        });
    }, []);

    return (
        <div style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            maxWidth: "500px",
            margin: "0 auto"
        }}>
            <div style={{marginBottom: "20px"}}>
                <label style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    color: "#00796b"
                }}>
                    Наименование:
                    <input
                        style={{
                            width: "90%",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            fontSize: "16px",
                            color: "#333",
                            marginTop: "8px"
                        }}
                        placeholder={'Введите наименование'}
                        type="text"
                        value={routeName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRouteName(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div style={{marginBottom: "20px"}}>
                <label style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    color: "#00796b"
                }}>
                    Описание:
                    <textarea
                        style={{
                            width: "90%",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            fontSize: "16px",
                            color: "#333",
                            resize: "vertical",
                            minHeight: "100px",
                            marginTop: "8px",
                            marginLeft: "16px"
                        }}
                        placeholder={'Введите описание'}
                        value={description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div style={{marginBottom: "20px"}}>
                <label style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    color: "#00796b"
                }}>
                    Назначенный грузоперевозчик:
                    <select
                        style={{
                            width: "95%",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            fontSize: "16px",
                            color: "#333",
                            marginTop: "8px",
                            backgroundColor: "#fff",
                            appearance: "none"
                        }}
                        value={assignedUser}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAssignedUser(e.target.value)}
                    >
                        <option value="" disabled>Назначьте пользователя</option>
                        <option value="">Не назначен</option>
                        {users.map((user: UserType) => (
                            <option key={user.id} value={user.username}>{user.username}</option>
                        ))}
                    </select>
                </label>
            </div>
            {!!routeStatus && <div style={{marginBottom: "20px"}}>
                <label style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    color: "#00796b"
                }}>
                    Статус маршрута: <h3 style={{
                    color: "#194b46",
                    margin: "0"
                }}>{!!routeStatus ? ROUTE_STATUS_MAP.get(routeStatus) : routeStatus}</h3>
                </label>
            </div>}
        </div>
    );
};

export default RouteAdminForm;