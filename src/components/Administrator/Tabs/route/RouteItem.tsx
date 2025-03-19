import React, {JSX} from "react";
import styles from "./RouteItem.module.css"
import {RouteType} from "../../../../redux/slices/RouteSlice";

const RouteItem: React.FC<{
    route: RouteType
    handleClick: (routeId: string) => void
}> = ({route, handleClick}): JSX.Element => {

    return (
        <tr>
            <td>{route.id}</td>
            <td>{route.name}</td>
            <td>{route.description}</td>
            <td>{route.assignedUsername}</td>
            <td>{route.pointsCount}</td>
            <td>
                <button
                    className={styles["view-button"]}
                    onClick={() => handleClick(route.id)}
                    title="Просмотр детальной информации"
                >
                    👁️
                </button>
            </td>
        </tr>
    );
}

export default RouteItem