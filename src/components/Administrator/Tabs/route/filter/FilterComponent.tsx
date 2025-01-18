import React, {FC, JSX, useState} from "react";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {setFilter} from "../../../../../redux/slices/FilterSlice";

const FilterComponent: FC = (): JSX.Element => {

    const [usernameInput, setUsernameInput] = useState<string>("");
    const dispatch: Dispatch = useDispatch()

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setUsernameInput(event.target.value);
    };

    const applyFilter = (): void => {
        dispatch(setFilter({
            username: usernameInput
        }))
    };

    return (
        <div>
            <label htmlFor="username-filter">Filter by Username:</label>
            <input
                id="username-filter"
                type="text"
                value={usernameInput}
                onChange={handleInputChange}
                placeholder="Enter username"
            />
            <button onClick={applyFilter}>Apply</button>
        </div>
    )
}

export default FilterComponent