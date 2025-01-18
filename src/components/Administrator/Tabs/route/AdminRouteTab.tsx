import React, {JSX, useState} from "react";
import RouteList from "./RouteList";
import FilterComponent from "./filter/FilterComponent";
import {useSelector} from "react-redux";
import {FilterType, selectFilter} from "../../../../redux/slices/FilterSlice";
import RouteWindow from "./window/RouteWindow";

const AdminRouteTab: React.FC = (): JSX.Element => {

    const filter: FilterType = useSelector(selectFilter)

    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    const openModal = (): void => {
        setModalOpen(true);
    };

    const closeModal = (): void => {
        setModalOpen(false);
    }

    return (
        <>
            <FilterComponent/>
            <RouteList filter={filter}/>
            <button onClick={openModal}>Create Route</button>
            {isModalOpen && (
                <RouteWindow
                    onCancel={closeModal}
                />
            )}
        </>
    );
}

export default AdminRouteTab;
