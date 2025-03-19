import React, {JSX, useState} from "react";
import RouteList from "./RouteList";
import FilterByFields from "../../../Menu/filter/FilterByFields";
import {useSelector} from "react-redux";
import {FilterType, selectFilter} from "../../../../redux/slices/FilterSlice";
import RouteWindow from "./window/RouteWindow";

const AdminRouteTab: React.FC = (): JSX.Element => {
    const filter: FilterType = useSelector(selectFilter);

    const [isModalOpen, setModalOpen] = useState<boolean>(false);


    const closeModal = (): void => {
        setModalOpen(false);
    };

    return (
        <>
            <FilterByFields/>
            <RouteList filter={filter}
                       setCreateModalOpen={setModalOpen}
            />
            {isModalOpen && <RouteWindow onCancel={closeModal}/>}
        </>
    );
};

export default AdminRouteTab;
