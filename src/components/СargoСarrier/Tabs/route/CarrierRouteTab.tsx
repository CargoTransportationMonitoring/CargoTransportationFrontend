import React, {JSX} from "react";
import RouteList from "../../../Administrator/Tabs/route/RouteList";
import {useSelector} from "react-redux";
import {FilterType, selectFilter} from "../../../../redux/slices/FilterSlice";
import FilterByFields from "../../../Menu/filter/FilterByFields";

const CarrierRouteTab: React.FC = (): JSX.Element => {

    const filter: FilterType = useSelector(selectFilter);

    return (
        <>
            <FilterByFields/>
            <RouteList filter={filter}/>
        </>
    )
}

export default CarrierRouteTab