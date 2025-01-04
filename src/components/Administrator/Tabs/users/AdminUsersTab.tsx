import React, {JSX, useState} from "react";
import UserWindow from "./UserWindow";

const AdminUsersTab: React.FC = (): JSX.Element => {

    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    const openModal = (): void => {
        setModalOpen(true);
    };

    const closeModal = (): void => {
        setModalOpen(false);
    }

    const handleLinkUser = (): void => {

    }

    return (
        <>
            <button onClick={openModal}>Link User</button>
            <div>Users</div>
            {isModalOpen && (
                <UserWindow
                    onCancel={closeModal}
                />
            )}
        </>
    )
}

export default AdminUsersTab