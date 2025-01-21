import React, {JSX} from "react";

const RouteForm: React.FC<{
    routeName: string,
    description: string,
    assignedUser: string,
    routeStatus?: "NEW" | "IN_PROGRESS" | "COMPLETED"
    setRouteName: (routeName: string) => void,
    setDescription: (description: string) => void,
    setAssignedUser: (assignedUser: string) => void,
    setRouteStatus: (routeStatus: "NEW" | "IN_PROGRESS" | "COMPLETED") => void
}> = ({
          routeName,
          description,
          assignedUser,
          routeStatus,
          setRouteName,
          setDescription,
          setAssignedUser,
          setRouteStatus
      }): JSX.Element => {

    return (
        <>
            <div>
                <label>
                    Name:
                    <input
                        placeholder={'Enter name'}
                        type="text"
                        value={routeName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRouteName(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Description:
                    <textarea
                        placeholder={'Enter description'}
                        value={description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Assigned User:
                    <input
                        placeholder={'Enter assigned username'}
                        type="text"
                        value={assignedUser}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAssignedUser(e.target.value)}
                    />
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
    );
};

export default RouteForm;
