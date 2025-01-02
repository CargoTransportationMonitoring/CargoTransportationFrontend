import axios from "axios";
import React, {JSX, useState} from "react";
import {authenticate, parseJwt, TokenId} from "../../../util/KeycloakUtils";
import {getIdToken, getToken} from "../../auth/KeycloakService";
import {API_V1_USER_PREFIX, SERVER_CORE_URI} from "../../../util/Constants";

const Profile: React.FC = (): JSX.Element => {

    const tokenData: TokenId = parseJwt(getIdToken());
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>(tokenData.given_name);
    const [lastName, setLastName] = useState<string>(tokenData.family_name);

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

    return (
        <div>
            <h2>Email: {tokenData.email}</h2>
            <div>
                <label>First name:</label>
                {isEditing ? (
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                    />
                ) : (
                    <h2>{firstName}</h2>
                )}
            </div>
            <div>
                <label>Last name:</label>
                {isEditing ? (
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                    />
                ) : (
                    <h2>{lastName}</h2>
                )}
            </div>
            <button onClick={toggleEditMode}>
                {isEditing ? "Сохранить" : "Редактировать"}
            </button>

            <button onClick={deleteProfile}>Удалить профиль</button>
        </div>
    );
}

export default Profile;