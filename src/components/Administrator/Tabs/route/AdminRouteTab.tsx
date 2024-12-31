import React, {JSX, useState} from "react";
import CreateRouteWindow from "./CreateRouteWindow";

const AdminRouteTab: React.FC = (): JSX.Element => {

    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    const openModal = (): void => {
        setModalOpen(true);
    };

    const closeModal = (): void => {
        setModalOpen(false);
    };

    const createRoute = (): void => {
        console.log("Route created!");
        closeModal();
    };

    return (
        <>
            <h1>Маршруты</h1>
            <p>Здесь будет информация о маршрутах</p>
            <button onClick={openModal}>Create Route</button>

            {isModalOpen && (
                <CreateRouteWindow
                    onCreate={createRoute}
                    onCancel={closeModal}
                />
            )}
        </>
    );
}

export default AdminRouteTab