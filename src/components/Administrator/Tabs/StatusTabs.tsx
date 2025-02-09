import React, {FC, JSX, useState} from "react";
import {setStatus} from "../../../redux/slices/FilterSlice";
import {Dispatch} from "@reduxjs/toolkit";
import styles from "./StatusTabs.module.css"
import {useDispatch} from "react-redux";

const TABS: string[] = ["NEW", "IN_PROGRESS", "COMPLETED"];


const StatusTabs: FC = (): JSX.Element => {

    const [activeTab, setActiveTab] = useState<string>(TABS[0]);
    const dispatch: Dispatch = useDispatch();

    const handleTabChange = (tab: string): void => {
        setActiveTab(tab);
        dispatch(setStatus(tab));
    };

    return (
        <div className={styles.tabs}>
            {TABS.map((tab: string) => (
                <button
                    key={tab}
                    className={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
                    onClick={() => handleTabChange(tab)}
                    tabIndex={0}
                    aria-selected={activeTab === tab}
                >
                    {tab.replace("_", " ").toUpperCase()}
                </button>
            ))}
        </div>
    )
}

export default StatusTabs