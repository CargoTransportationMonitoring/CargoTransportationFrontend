import React, {JSX} from "react";
import axios from "axios";
import {API_V1_USER_PREFIX, SERVER_CORE_URI} from "../../../util/Constants";
import {getIdToken, getToken} from "../../../util/KeycloakService";
import {setError, setInfo} from "../../../redux/slices/InfoTabSlice";
import {authenticate, parseJwt, TokenId} from "../../../util/KeycloakUtils";
import {Dispatch} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";

const DeleteProfileButton: React.FC = (): JSX.Element => {

    const tokenData: TokenId = parseJwt(getIdToken());
    const dispatch: Dispatch = useDispatch()

    const deleteProfile = (): void => {
        axios.delete(`${SERVER_CORE_URI}/${API_V1_USER_PREFIX}/${tokenData.sub}`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json"
                }
            })
            .then((): void => {
                dispatch(setInfo("Профиль успешно удален"))
                authenticate()
            })
            .catch((error): void => {
                dispatch(setError(`Ошибка при удалении профиля, ${error}`));
            });
    }

    return (
        <button onClick={deleteProfile}>Удалить профиль</button>
    )
}

export default DeleteProfileButton;