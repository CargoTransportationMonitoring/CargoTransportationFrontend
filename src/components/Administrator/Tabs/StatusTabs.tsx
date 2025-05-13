import React, {FC, JSX, useState} from "react";
import {setStatus} from "../../../redux/slices/FilterSlice";
import {Dispatch} from "@reduxjs/toolkit";
import styles from "./StatusTabs.module.css"
import {useDispatch} from "react-redux";
import {isAdmin} from "../../../util/KeycloakUtils";

const TABS: string[] = ["NEW", "IN_PROGRESS", "COMPLETED"];
export const ROUTE_STATUS_MAP= new Map<string, string>([
    ["NEW", "Новый"],
    ["IN_PROGRESS", "В прогрессе"],
    ["COMPLETED", "Выполненный"]
]);

const StatusTabs: FC<{
    setCreateModalOpen: (isCreateModalOpen: boolean) => void
}> = ({setCreateModalOpen}): JSX.Element => {

    const [activeTab, setActiveTab] = useState<string>(TABS[0]);
    const dispatch: Dispatch = useDispatch();

    const handleTabChange = (tab: string): void => {
        setActiveTab(tab);
        dispatch(setStatus(tab));
    };

    const openModal = (): void => {
        setCreateModalOpen(true)
    }

    return (
        <div className={styles.tabs}>
            {isAdmin() && <button className={styles.createButton} onClick={openModal}>Создать маршрут</button>}
            <div className={styles.tabContainer}>
                {TABS.map((tab: string) => (
                    <button
                        key={tab}
                        className={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
                        onClick={() => handleTabChange(tab)}
                        tabIndex={0}
                        aria-selected={activeTab === tab}
                    >
                        {ROUTE_STATUS_MAP.get(tab)}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default StatusTabs