import React, {FC, JSX, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {setFilterByFields} from "../../../redux/slices/FilterSlice";
import {UserType} from "../../Administrator/Tabs/users/AdminUsersTab";
import axios, {AxiosResponse} from "axios";
import {SERVER_CORE_URI} from "../../../util/Constants";
import {getToken} from "../../../util/KeycloakService";
import {setError} from "../../../redux/slices/InfoTabSlice";
import {isAdmin} from "../../../util/KeycloakUtils";

const FilterByFields: FC = (): JSX.Element => {

    const [assignedUser, setAssignedUser] = useState<string | undefined>(undefined);
    const [pointsNumberFrom, setPointsNumberFrom] = useState<number | undefined>(undefined);
    const [pointsNumberTo, setPointsNumberTo] = useState<number | undefined>(undefined);
    const [description, setDescription] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [users, setUsers] = useState<UserType[]>([]);
    const dispatch: Dispatch = useDispatch()

    const applyFilter = (): void => {
        dispatch(setFilterByFields({
            username: assignedUser,
            description: description,
            pointsNumberFrom: pointsNumberFrom,
            pointsNumberTo: pointsNumberTo,
            name: name
        }))
    };

    useEffect((): void => {
        if (!isAdmin()) return
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
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            {isAdmin() && <div>
                <label htmlFor="username-filter">Filter by Username:</label>
                <select value={assignedUser}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAssignedUser(e.target.value)}
                >
                    <option value="" disabled>Select a user</option>
                    <option value="">No User</option>
                    {users.map((user: UserType) => (
                        <option key={user.id} value={user.username}>{user.username}</option>
                    ))}
                </select>
            </div>}
            <div>
                <label htmlFor="name-filter">Filter by name:</label>
                <input
                    id="name-filter"
                    type="text"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setName(e.target.value)
                    }
                    placeholder="Enter route name"
                />
            </div>
            <div>
                <label htmlFor="description-filter">Filter by description:</label>
                <input
                    id="description-filter"
                    type="text"
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setDescription(e.target.value)
                    }
                    placeholder="Enter route description"
                />
            </div>
            <div>
                <label htmlFor="points-number-from-filter">Min Points:</label>
                <input
                    id="points-number-from-filter"
                    type="number"
                    value={pointsNumberFrom}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                        const value: string = e.target.value
                        setPointsNumberFrom(value ? parseInt(value, 10) : undefined)
                    }}
                    placeholder="Enter points number from"
                />
            </div>
            <div>
                <label htmlFor="points-number-to-filter">Max Points:</label>
                <input
                    id="points-number-to-filter"
                    type="number"
                    value={pointsNumberTo}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                        const value: string = e.target.value
                        setPointsNumberTo(value ? parseInt(value, 10) : undefined)
                    }}
                    placeholder="Enter points number to"
                />
            </div>
            <button onClick={applyFilter}>Apply</button>
        </div>
    )
}

export default FilterByFields