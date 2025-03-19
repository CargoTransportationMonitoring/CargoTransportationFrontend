import React, {JSX, useState} from "react";
import RouteList from "../../../Administrator/Tabs/route/RouteList";
import {useSelector} from "react-redux";
import {FilterType, selectFilter} from "../../../../redux/slices/FilterSlice";
import FilterByFields from "../../../Menu/filter/FilterByFields";

const CarrierRouteTab: React.FC = (): JSX.Element => {

    const filter: FilterType = useSelector(selectFilter);
    const [is, setIs] = useState<boolean>(false)

    return (
        <>
            <FilterByFields/>
            <RouteList filter={filter} setCreateModalOpen={setIs}/>
        </>
    )
}

export default CarrierRouteTab