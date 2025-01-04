import React, {JSX, useState} from "react";
import RouteList from "../../../Administrator/Tabs/route/RouteList";
import RouteWindow from "../../../Administrator/Tabs/route/window/RouteWindow";

const CarrierRouteTab: React.FC = (): JSX.Element => {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [activeRouteId, setActiveRouteId] = useState<string | null>(null);

    const handleViewRouteClick = (routeId: string): void => {
        setActiveRouteId(routeId)
        openModal()
    }

    const openModal = (): void => {
        setModalOpen(true);
    };

    const closeModal = (): void => {
        setModalOpen(false);
    }

    return (
        <>
            <RouteList handleClick={handleViewRouteClick}/>
            {isModalOpen && (
                <RouteWindow
                    onCancel={closeModal}
                    routeId={activeRouteId}
                />
            )}
        </>
    )
}

export default CarrierRouteTab