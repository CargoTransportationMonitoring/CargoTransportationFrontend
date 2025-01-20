import axios, {AxiosResponse} from "axios";
import React, {JSX, useState} from "react";
import {authenticate, parseJwt, TokenId} from "../../../util/KeycloakUtils";
import {getIdToken, getToken} from "../../auth/KeycloakService";
import {API_V1_USER_PREFIX, SERVER_CORE_URI} from "../../../util/Constants";
import UserLinkWindow from "./UserLinkWindow";
import {Dispatch} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {setError} from "../../../redux/slices/ErrorSlice";

const UserProfile: React.FC = (): JSX.Element => {

    const tokenData: TokenId = parseJwt(getIdToken());
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>(tokenData.given_name);
    const [lastName, setLastName] = useState<string>(tokenData.family_name);
    const [isAdminPresent, setIsAdminPresent] = useState<boolean>(!!localStorage.getItem("adminUsername"))
    const dispatch: Dispatch = useDispatch()

    const openModal = (): void => {
        setModalOpen(true);
    };

    const closeModal = (): void => {
        setModalOpen(false);
    }

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
                    console.log("Данные успешно сохранены:", {firstName, lastName});
                })
                .catch((error): void => {
                    console.error("Ошибка при сохранении данных:", error);
                });
        }
        setIsEditing(!isEditing);
    };

    const deleteProfile = (): void => {
        axios.delete(`${SERVER_CORE_URI}/${API_V1_USER_PREFIX}/${tokenData.sub}`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json"
                }
            })
            .then((): void => {
                console.log("Профиль успешно удален")
                authenticate()
            })
            .catch((error): void => {
                console.error("Ошибка при удалении профиля:", error);
            });
    }

    const handleUnlink = (): void => {
        axios.put(`${SERVER_CORE_URI}/${API_V1_USER_PREFIX}/unlink/${tokenData.sub}`, {}, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json"
            }
        }).then((response: AxiosResponse): void => {
            console.log("Unlinked successfully")
            localStorage.removeItem("adminUsername")
            setIsAdminPresent(false)
        }).catch((error): void => {
            dispatch(setError(error))
        })
    }

    return (
        <div>
            <div>
                {isAdminPresent
                    ? <>
                        <h2>Your Administrator username: {localStorage.getItem("adminUsername")}</h2>
                        <button onClick={handleUnlink}>Открепиться от администратора</button>
                    </>
                    : <>
                        <h2>You are not attachment to any Administrator</h2>
                        <button onClick={openModal}>Прилинковаться к администратору</button>
                    </>
                }
            </div>

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
            <button onClick={deleteProfile}>Удалить профиль</button>
            {isModalOpen && (
                <UserLinkWindow
                    onCancel={closeModal}
                    updateAdmin={setIsAdminPresent}
                />
            )}
        </div>
    );
}

export default UserProfile;