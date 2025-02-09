import React, {JSX, useEffect} from "react";
import axios, {AxiosResponse} from "axios";
import {API_V1_USER_PREFIX, SERVER_CORE_URI} from "../../../util/Constants";
import {getIdToken, getToken} from "../../../util/KeycloakService";
import {setError, setInfo} from "../../../redux/slices/InfoTabSlice";
import {parseJwt, TokenId} from "../../../util/KeycloakUtils";
import {Dispatch} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";

const LinkAdminSection: React.FC<{
    setModalOpen: (isOpen: boolean) => void
    adminUsername: string | undefined
    setAdminUsername: (adminUsername: string | undefined) => void
}> = ({setModalOpen, adminUsername, setAdminUsername}): JSX.Element => {
    const tokenData: TokenId = parseJwt(getIdToken());
    const dispatch: Dispatch = useDispatch()

    const handleUnlink = (): void => {
        axios.put(`${SERVER_CORE_URI}/${API_V1_USER_PREFIX}/unlink/${tokenData.sub}`, {}, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json"
            }
        }).then((response: AxiosResponse): void => {
            dispatch(setInfo('Вы успешно открепились от администратора'))
            setAdminUsername(undefined)
        }).catch((error): void => {
            if (error.response && error.response.data && error.response.data.error) {
                dispatch(setError(`Ошибка обновления маршрута: ${error.response.data.error}`));
            } else {
                dispatch(setError(`Ошибка обновления маршрута: ${error.message}`));
            }
        })
    }

    const openModal = (): void => {
        setModalOpen(true);
    };

    useEffect((): void => {
        axios.get(`${SERVER_CORE_URI}/${API_V1_USER_PREFIX}/${tokenData.sub}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json"
            }
        }).then((response: AxiosResponse): void => {
            const adminUsername: string | undefined = response.data.adminUsername
            if (adminUsername) {
                setAdminUsername(adminUsername)
            }
        })
    }, []);


    return (
        <div>
            {adminUsername
                ? <>
                    <h2>Your Administrator username: {adminUsername}</h2>
                    <button onClick={handleUnlink}>Открепиться от администратора</button>
                </>
                : <>
                    <h2>You are not attachment to any Administrator</h2>
                    <button onClick={openModal}>Прилинковаться к администратору</button>
                </>
            }
        </div>
    )
}

export default LinkAdminSection;