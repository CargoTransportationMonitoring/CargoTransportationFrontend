import React, {JSX, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {SERVER_CORE_URI} from "../../../../../util/Constants";
import {getToken} from "../../../../../util/KeycloakService";
import {setError} from "../../../../../redux/slices/InfoTabSlice";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {UserType} from "../../../../Menu/filter/FilterByFields";

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
    const dispatch: Dispatch = useDispatch()

    useEffect((): void => {
        axios.get(`${SERVER_CORE_URI}/api/v1/users`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`
            }
        }).then((response: AxiosResponse): void => {
            setUsers(response.data)
        }).catch((error): void => {
            dispatch(setError(error))
        })
    }, [])

    return (
        <>
            <div>
                <label>
                    Name:
                    <input
                        placeholder={'Enter name'}
                        type="text"
                        value={routeName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRouteName(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Description:
                    <textarea
                        placeholder={'Enter description'}
                        value={description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Assigned User:
                    <select value={assignedUser}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAssignedUser(e.target.value)}
                    >
                        <option value="" disabled>Select a user</option>
                        <option value="">No User</option>
                        {users.map((user: UserType) => (
                            <option key={user.id} value={user.username}>{user.username}</option>
                        ))}
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Route status: <h3>{routeStatus}</h3>
                </label>
            </div>
        </>
    );
};

export default RouteAdminForm;
