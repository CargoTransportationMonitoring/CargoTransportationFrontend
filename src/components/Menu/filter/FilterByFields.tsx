import React, {FC, JSX, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {setFilterByFields} from "../../../redux/slices/FilterSlice";
import axios, {AxiosResponse} from "axios";
import {SERVER_CORE_URI} from "../../../util/Constants";
import {getToken} from "../../../util/KeycloakService";
import {setError} from "../../../redux/slices/InfoTabSlice";
import {isAdmin} from "../../../util/KeycloakUtils";
import styles from "./FilterByFields.module.css"

export type UserType = {
    username: string,
    id: string
}

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
        <div className={styles.filterWrapper}>
            <div className={styles.container}>
                {isAdmin() && (
                    <div className={styles.fieldContainer}>
                        <label className={styles.label} htmlFor="username-filter">
                            Имя пользователя:
                        </label>
                        <select
                            id="username-filter"
                            value={assignedUser}
                            onChange={(e) => setAssignedUser(e.target.value)}
                            className={styles.input}
                        >
                            <option value="" disabled>
                                Select a user
                            </option>
                            <option value="">Не выбран</option>
                            {users.map((user: UserType) => (
                                <option key={user.id} value={user.username}>
                                    {user.username}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div className={styles.fieldContainer}>
                    <label className={styles.label} htmlFor="name-filter">
                        Наименование маршрута:
                    </label>
                    <input
                        id="name-filter"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Наименование"
                        className={styles.input}
                    />
                </div>
                <div className={styles.fieldContainer}>
                    <label className={styles.label} htmlFor="description-filter">
                        Описание:
                    </label>
                    <input
                        id="description-filter"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Описание"
                        className={styles.input}
                    />
                </div>
                <div className={styles.fieldContainer}>
                    <label className={styles.label} htmlFor="points-number-from-filter">
                        Минимальное количество точек:
                    </label>
                    <input
                        id="points-number-from-filter"
                        type="number"
                        value={pointsNumberFrom ?? ""}
                        onChange={(e) =>
                            setPointsNumberFrom(e.target.value ? parseInt(e.target.value, 10) : undefined)
                        }
                        placeholder="Количество точек"
                        min={0}
                        step={1}
                        className={styles.input}
                    />
                </div>
                <div className={styles.fieldContainer}>
                    <label className={styles.label} htmlFor="points-number-to-filter">
                        Максимальное количество точек:
                    </label>
                    <input
                        id="points-number-to-filter"
                        type="number"
                        value={pointsNumberTo ?? ""}
                        onChange={(e) =>
                            setPointsNumberTo(e.target.value ? parseInt(e.target.value, 10) : undefined)
                        }
                        placeholder="Количество точек"
                        className={styles.input}
                    />
                </div>
                <button className={styles.applyButton} onClick={applyFilter}>
                    Применить
                </button>
            </div>
        </div>
    );
}

export default FilterByFields