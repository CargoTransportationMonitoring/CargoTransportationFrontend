import React, {JSX, useEffect, useState} from "react";
import LinkUserWindow from "./LinkUserWindow";
import axios, {AxiosResponse} from "axios";
import {SERVER_CORE_URI} from "../../../../util/Constants";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {setError} from "../../../../redux/slices/InfoTabSlice";
import {getToken} from "../../../../util/KeycloakService";
import {NavigateFunction, useNavigate} from "react-router-dom";

export type UserType = {
    username: string,
    id: string
}

const AdminUsersTab: React.FC = (): JSX.Element => {

    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [users, setUsers] = useState<UserType[]>([]);
    const dispatch: Dispatch = useDispatch()
    const navigate: NavigateFunction = useNavigate()

    const openModal = (): void => {
        setModalOpen(true);
    };

    const closeModal = (): void => {
        setModalOpen(false);
    }

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
            <button onClick={openModal}>Link User</button>
            <div>Users</div>
            {users.map((user: UserType): JSX.Element => (
                <div
                    key={user.id}
                    onClick={(): void => {
                        navigate(`/admin/users/${user.id}`, { state: { username: user.username }});
                    }}
                >
                    {user.username}
                </div>
            ))}
            {isModalOpen && (
                <LinkUserWindow
                    onCancel={closeModal}
                />
            )}
        </>
    )
}

export default AdminUsersTab