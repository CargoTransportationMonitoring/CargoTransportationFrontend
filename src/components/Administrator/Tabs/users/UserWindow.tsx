import React, {JSX, useState} from "react";
import styles from './UserWindow.module.css'
import axios, {AxiosResponse} from "axios";
import {API_V1_USER_PREFIX, SERVER_CORE_URI} from "../../../../util/Constants";
import {getToken} from "../../../auth/KeycloakService";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {setError} from "../../../../redux/slices/ErrorSlice";
import CodeDisplay from "./CodeDisplay";

const UserWindow: React.FC<{
    onCancel: () => void
}> = ({onCancel}): JSX.Element => {

    const [username, setUsername] = useState<string>('')
    const [generatedCode, setGeneratedCode] = useState<string>('')
    const dispatch: Dispatch = useDispatch()
    const handleGenerateCode = (): void => {
        axios.get(`${SERVER_CORE_URI}/${API_V1_USER_PREFIX}/generateCode?username=${username}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
        ).then((response: AxiosResponse): void => {
            console.log("Code successfully generated", response)
            setGeneratedCode(response.data)
        }).catch((error): void => {
            dispatch(setError(error))
        })
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>
                    Для того, чтобы прикрепить к себе перевозчика необходимо создать уникальный персональный код и
                    отправить его пользователю, которого вы хотите закрепить за собой.
                    Пользователю необходимо будет вставить этот код в своем профиле
                </h2>
                <input
                    value={username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                    placeholder={'Enter username'}
                />
                <CodeDisplay generatedCode={generatedCode}/>
                <div className={styles.buttons}>
                    <button className={styles.button} onClick={handleGenerateCode}>Сгенерировать код</button>
                    <button className={styles.button} onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default UserWindow