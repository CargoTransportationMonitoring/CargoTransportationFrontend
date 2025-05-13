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
        <div style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            maxWidth: "500px",
            margin: "0 auto"
        }}>
            <div style={{marginBottom: "20px"}}>
                <label style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    color: "#00796b"
                }}>
                    Наименование:
                    <span style={{
                        fontWeight: "normal",
                        marginLeft: "8px",
                        color: "#333",
                    }}>{routeName}</span>
                </label>
            </div>
            <div style={{marginBottom: "20px"}}>
                <label style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    color: "#00796b"
                }}>
                    Описание:
                    <p style={{
                        fontWeight: "normal",
                        marginTop: "4px",
                        padding: "8px",
                        backgroundColor: "#e0f2f1",
                        borderRadius: "4px",
                        color: "#333",
                    }}>{description}</p>
                </label>
            </div>
            <div>
                <label style={{
                    display: "block",
                    fontWeight: "bold",
                    marginBottom: "8px",
                    color: "#00796b"
                }}>
                    Статус маршрута:
                    <select style={{
                        marginLeft: "8px",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #00796b",
                        backgroundColor: "#e0f2f1",
                        color: "#00796b",
                        fontSize: "16px",
                        fontWeight: "bold",
                    }}
                            value={routeStatus}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                setRouteStatus(e.target.value as "NEW" | "IN_PROGRESS" | "COMPLETED")
                            }
                    >
                        <option value="NEW">Новый</option>
                        <option value="IN_PROGRESS">В прогрессе</option>
                        <option value="COMPLETED">Завершенный</option>
                    </select>
                </label>
            </div>
        </div>
    )
}

export default RouteCarrierForm;