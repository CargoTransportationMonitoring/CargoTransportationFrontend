import React, {JSX} from "react";
import styles from './RouteItem.module.css'

const RouteItem: React.FC<{
    routeId: string
    handleClick: (routeId: string) => void
}> = ({routeId, handleClick}): JSX.Element => {
    return (
        <div className={styles.routeItem}>
            <p className={styles.routeId}>
                Route ID: {routeId}
                <button className={styles.viewButton} onClick={() => handleClick(routeId)} title="View Details">
                    👁️
                </button>
            </p>
        </div>
    )
}

export default RouteItem