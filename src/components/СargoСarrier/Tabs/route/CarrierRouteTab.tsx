import React, {JSX} from "react";
import RouteList from "../../../Administrator/Tabs/route/RouteList";
import {useSelector} from "react-redux";
import {FilterType, selectFilter} from "../../../../redux/slices/FilterSlice";

const CarrierRouteTab: React.FC = (): JSX.Element => {

    const filter: FilterType = useSelector(selectFilter);

    return (
        <RouteList filter={filter}/>
    )
}

export default CarrierRouteTab