import React, {JSX, useState} from "react";
import styles from "../../Administrator/Tabs/route/window/CreateRouteWindow.module.css";
import axios, {AxiosResponse} from "axios";
import {API_V1_USER_PREFIX, SERVER_CORE_URI} from "../../../util/Constants";
import {getIdToken, getToken} from "../../../util/KeycloakService";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {setError} from "../../../redux/slices/InfoTabSlice";
import {parseJwt, TokenId} from "../../../util/KeycloakUtils";

const UserLinkWindow: React.FC<{
    onCancel: () => void
    updateAdmin: (adminUsername: string) => void
}> = ({onCancel, updateAdmin}): JSX.Element => {

    const tokenData: TokenId = parseJwt(getIdToken());
    const [linkCode, setLinkCode] = useState<string>('')
    const dispatch: Dispatch = useDispatch()
    const handleLinkAdmin = (): void => {
        console.log(`linkCode: ${linkCode}`)
        axios.put(`${SERVER_CORE_URI}/${API_V1_USER_PREFIX}/${tokenData.sub}/link`, {
            code: linkCode
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        }).then((response: AxiosResponse): void => {
            updateAdmin(response.data)
        }).catch((error): void => {
            dispatch(setError(error))
        }).finally((): void => {
            onCancel()
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