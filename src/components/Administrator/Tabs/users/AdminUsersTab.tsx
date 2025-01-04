import React, {JSX, useEffect, useState} from "react";
import UserWindow from "./UserWindow";
import axios, {AxiosResponse} from "axios";
import {SERVER_CORE_URI} from "../../../../util/Constants";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {setError} from "../../../../redux/slices/ErrorSlice";
import {getToken} from "../../../auth/KeycloakService";

const AdminUsersTab: React.FC = (): JSX.Element => {

    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [users, setUsers] = useState<string[]>([]);
    const dispatch: Dispatch = useDispatch()

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
            {users.map((username: string): JSX.Element => (
                <div key={username}>
                    {username}
                </div>
            ))}
            {isModalOpen && (
                <UserWindow
                    onCancel={closeModal}
                />
            )}
        </>
    )
}

export default AdminUsersTab