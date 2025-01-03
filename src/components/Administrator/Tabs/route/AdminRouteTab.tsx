import React, {JSX, useState} from "react";
import RouteWindow from "./RouteWindow";
import RouteList from "./RouteList";

const AdminRouteTab: React.FC = (): JSX.Element => {

    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [activeRouteId, setActiveRouteId] = useState<string | null>(null);

    const openModal = (): void => {
        setModalOpen(true);
    };

    const closeModal = (): void => {
        setModalOpen(false);
    }

    const handleViewRouteClick = (routeId: string): void => {
        setActiveRouteId(routeId)
        openModal()
    }

    const handleCreateClick = (): void => {
        setActiveRouteId(null)
        openModal()
    }

    return (
        <>
            <RouteList handleClick={handleViewRouteClick}/>
            <button onClick={handleCreateClick}>Create Route</button>
            {isModalOpen && (
                <RouteWindow
                    onCancel={closeModal}
                    routeId={activeRouteId}
                />
            )}
        </>
    );
}

export default AdminRouteTab