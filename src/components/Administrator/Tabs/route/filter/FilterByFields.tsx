import React, {FC, JSX, useState} from "react";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {setFilterByFields} from "../../../../../redux/slices/FilterSlice";

const FilterByFields: FC = (): JSX.Element => {

    const [usernameInput, setUsernameInput] = useState<string>("");
    const [pointsNumberFrom, setPointsNumberFrom] = useState<number | undefined>(undefined);
    const [pointsNumberTo, setPointsNumberTo] = useState<number | undefined>(undefined);
    const [description, setDescription] = useState<string>("");
    const [name, setName] = useState<string>("");
    const dispatch: Dispatch = useDispatch()

    const applyFilter = (): void => {
        dispatch(setFilterByFields({
            username: usernameInput,
            description: description,
            pointsNumberFrom: pointsNumberFrom,
            pointsNumberTo: pointsNumberTo,
            name: name
        }))
    };

    return (
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <div>
                <label htmlFor="username-filter">Filter by Username:</label>
                <input
                    id="username-filter"
                    type="text"
                    value={usernameInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUsernameInput(e.target.value)
                    }
                    placeholder="Enter username"
                />
            </div>
            <div>
                <label htmlFor="name-filter">Filter by description:</label>
                <input
                    id="name-filter"
                    type="text"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setName(e.target.value)
                    }
                    placeholder="Enter route name"
                />
            </div>
            <div>
                <label htmlFor="points-number-from-filter">Filter by Points:</label>
                <input
                    id="points-number-from-filter"
                    type="number"
                    value={pointsNumberFrom}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                        const value: string = e.target.value
                        setPointsNumberFrom(value ? parseInt(value, 10) : undefined)
                    }}
                    placeholder="Enter points number from"
                />
            </div>
            <div>
                <label htmlFor="points-number-to-filter">Filter by Points:</label>
                <input
                    id="points-number-to-filter"
                    type="number"
                    value={pointsNumberTo}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                        const value: string = e.target.value
                        setPointsNumberTo(value ? parseInt(value, 10) : undefined)
                    }}
                    placeholder="Enter points number to"
                />
            </div>
            <div>
                <label htmlFor="description-filter">Filter by description:</label>
                <input
                    id="description-filter"
                    type="text"
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setDescription(e.target.value)
                    }
                    placeholder="Enter description"
                />
            </div>
            <button onClick={applyFilter}>Apply</button>
        </div>
    )
}

export default FilterByFields