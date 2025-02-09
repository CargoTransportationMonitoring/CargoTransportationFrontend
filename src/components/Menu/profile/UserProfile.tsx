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

const UserProfile: React.FC = (): JSX.Element => {

    const tokenData: TokenId = parseJwt(getIdToken());
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
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


    const closeModal = (): void => {
        setModalOpen(false);
    }

    return (
        <div>
            {!isAdmin() && <LinkAdminSection setModalOpen={setModalOpen}
                                             adminUsername={adminUsername}
                                             setAdminUsername={setAdminUsername}/>}
            <h2>Email: {tokenData.email}</h2>
            <div>
                <label htmlFor="firstName">First name:</label>
                {isEditing ? (
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                    />
                ) : (
                    <h2 id="firstName">{firstName}</h2>
                )}
            </div>
            <div>
                <label htmlFor="lastName">Last name:</label>
                {isEditing ? (
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                    />
                ) : (
                    <h2 id="lastName">{lastName}</h2>
                )}
            </div>
            <button onClick={toggleEditMode}>
                {isEditing ? "Сохранить" : "Редактировать"}
            </button>
            {!isAdmin() && <DeleteProfileButton/>}
            {isModalOpen && (
                <UserLinkWindow
                    onCancel={closeModal}
                    updateAdmin={setAdminUsername}
                />
            )}
        </div>
    );
}

export default UserProfile;