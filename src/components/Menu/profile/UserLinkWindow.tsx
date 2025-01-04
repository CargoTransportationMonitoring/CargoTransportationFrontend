import React, {JSX, useState} from "react";
import styles from "../../Administrator/Tabs/route/window/CreateRouteWindow.module.css";
import axios, {AxiosResponse} from "axios";
import {API_V1_USER_PREFIX, SERVER_CORE_URI} from "../../../util/Constants";
import {getToken} from "../../auth/KeycloakService";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {setError} from "../../../redux/slices/ErrorSlice";

const UserLinkWindow: React.FC<{
    onCancel: () => void
    updateAdmin: (isAdminPresent: boolean) => void
}> = ({onCancel, updateAdmin}): JSX.Element => {

    const [linkCode, setLinkCode] = useState<string>('')
    const dispatch: Dispatch = useDispatch()
    const handleLinkAdmin = (): void => {
        console.log(`linkCode: ${linkCode}`)
        axios.put(`${SERVER_CORE_URI}/${API_V1_USER_PREFIX}/link`, {
            code: linkCode
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        }).then((response: AxiosResponse): void => {
            localStorage.setItem('adminUsername', response.data)
            onCancel()
            updateAdmin(true)
        }).catch((error): void => {
            dispatch(setError(error))
        })
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>Прилинковаться к администратору</h2>

                <div className={styles.buttons}>
                    <input
                        value={linkCode}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLinkCode(e.target.value)}
                        placeholder={'Enter code'}
                    />
                    <div className={styles.buttons}>
                        <button className={styles.button} onClick={handleLinkAdmin}>
                            Присоединиться к администратору
                        </button>
                        <button className={styles.button} onClick={onCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserLinkWindow