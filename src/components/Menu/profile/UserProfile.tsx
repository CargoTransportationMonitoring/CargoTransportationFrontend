import axios from "axios";
import React, {JSX, useState} from "react";
import {isAdmin, parseJwt, TokenId} from "../../../util/KeycloakUtils";
import {getIdToken, getToken} from "../../../util/KeycloakService";
import {API_V1_USER_PREFIX, SERVER_CORE_URI} from "../../../util/Constants";
import UserLinkWindow from "./UserLinkWindow";
import {Dispatch} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {setError, setInfo} from "../../../redux/slices/InfoTabSlice";
import DeleteProfileButton from "./DeleteProfileButton";
import LinkAdminSection from "./LinkAdminSection";
import styles from "./UserProfile.module.css"
import LinkUserWindow from "../../Administrator/Tabs/users/LinkUserWindow";

const UserProfile: React.FC = (): JSX.Element => {

    const tokenData: TokenId = parseJwt(getIdToken());
    const [isModalUserOpen, setModalUserOpen] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>(tokenData.given_name);
    const [lastName, setLastName] = useState<string>(tokenData.family_name);
    const [adminUsername, setAdminUsername] = useState<string | undefined>(undefined)
    const dispatch: Dispatch = useDispatch()

    const toggleEditMode = (): void => {
        if (isEditing) {
            axios.put(
                `${SERVER_CORE_URI}/${API_V1_USER_PREFIX}/${tokenData.sub}`,
                {
                    userId: tokenData.sub,
                    name: firstName,
                    surname: lastName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        "Content-Type": "application/json",
                    },
                }
            )
                .then((): void => {
                    dispatch(setInfo("Профиль успешно обновлен"));
                })
                .catch((error): void => {
                    dispatch(setError(`Ошибка при сохранении данных: ${error}`));
                });
        }
        setIsEditing(!isEditing);
    };

    const cancel = (): void => {
        setIsEditing(false)
    }

    return (
        <div>
            {!isAdmin() &&
                <div className={styles.profileContainer}>
                    <LinkAdminSection setModalOpen={setModalUserOpen} adminUsername={adminUsername}
                                      setAdminUsername={setAdminUsername}/>
                </div>}
            <div className={styles.profileContainer}>
                <div className={styles.profileField}>
                    <label className={styles.label}>Email:</label>
                    <span>{tokenData.email}</span>
                </div>

                <div className={styles.profileField}>
                    <label className={styles.label}>Имя:</label>
                    {isEditing ? (
                        <input className={styles.inputField} type="text" value={firstName}
                               onChange={(e) => setFirstName(e.target.value)}/>
                    ) : (
                        <span>{firstName}</span>
                    )}
                </div>
                <div className={styles.profileField}>
                    <label className={styles.label}>Фамилия:</label>
                    {isEditing ? (
                        <input className={styles.inputField} type="text" value={lastName}
                               onChange={(e) => setLastName(e.target.value)}/>
                    ) : (
                        <span>{lastName}</span>
                    )}
                </div>
                <button onClick={toggleEditMode}>
                    {isEditing ? "Сохранить" : "Редактировать"}
                </button>
                {isEditing && <button onClick={cancel} style={{
                    marginLeft: 15
                }}>Отмена</button>}
                {!isAdmin() && !isEditing && <DeleteProfileButton/>}
                {isModalUserOpen && (
                    <UserLinkWindow
                        onCancel={() => setModalUserOpen(false)}
                        updateAdmin={setAdminUsername}
                    />
                )}
            </div>
        </div>
    );
}

export default UserProfile;