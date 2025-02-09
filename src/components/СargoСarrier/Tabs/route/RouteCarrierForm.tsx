import React, {JSX} from "react";

const RouteCarrierForm: React.FC<{
    routeName: string,
    description: string,
    assignedUser: string,
    routeStatus?: "NEW" | "IN_PROGRESS" | "COMPLETED"
    setRouteStatus: (routeStatus: "NEW" | "IN_PROGRESS" | "COMPLETED") => void
}> = ({
          routeName,
          description,
          assignedUser,
          routeStatus,
          setRouteStatus
      }): JSX.Element => {
    return (
        <>
            <div>
                <label>
                    Name:
                    <span>{routeName}</span>
                </label>
            </div>
            <div>
                <label>
                    Description:
                    <p>{description}</p>
                </label>
            </div>
            <div>
                <label>
                    Assigned User:
                    <span>{assignedUser}</span>
                </label>
            </div>
            <div>
                <label>
                    Route status:
                    <select
                        value={routeStatus}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            setRouteStatus(e.target.value as "NEW" | "IN_PROGRESS" | "COMPLETED")
                        }
                    >
                        <option value="NEW">NEW</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                    </select>
                </label>
            </div>
        </>
    )
}

export default RouteCarrierForm;