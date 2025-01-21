import {createSlice, PayloadAction, Slice} from "@reduxjs/toolkit";
import {RootState} from "../store";

export type FilterType = {
    username: string,
    pointsNumberFrom?: number,
    pointsNumberTo?: number,
    description: string,
    name: string,
    routeStatus: string
}

export type FilterByFieldsType = {
    username: string,
    pointsNumberFrom?: number,
    pointsNumberTo?: number,
    description: string,
    name: string
}

const initialState: FilterType = {username: "", description: "", routeStatus: "", name: ""}

export const filterSlice: Slice<FilterType> = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilter: (state: FilterType, action: PayloadAction<FilterType>): FilterType => {
            return action.payload
        },
        setStatus: (state: FilterType, action: PayloadAction<string>): FilterType => {
            return {...state, routeStatus: action.payload}
        },
        setUsername: (state: FilterType, action: PayloadAction<string>): FilterType => {
            return {...state, username: action.payload}
        },
        setDescription: (state: FilterType, action: PayloadAction<string>): FilterType => {
            return {...state, description: action.payload}
        },
        setPointsNumberFrom: (state: FilterType, action: PayloadAction<number>): FilterType => {
            return {...state, pointsNumberFrom: action.payload}
        },
        setPointsNumberTo: (state: FilterType, action: PayloadAction<number>): FilterType => {
            return {...state, pointsNumberTo: action.payload}
        },
        setName: (state: FilterType, action: PayloadAction<string>): FilterType => {
            return {...state, name: action.payload}
        },
        setFilterByFields: (state: FilterType, action: PayloadAction<FilterByFieldsType>): FilterType => {
            return {
                ...state,
                username: action.payload.username,
                description: action.payload.description,
                pointsNumberFrom: action.payload.pointsNumberFrom,
                pointsNumberTo: action.payload.pointsNumberTo,
                name: action.payload.name
            }
        }
    }
})

export const selectFilter = (state: RootState): FilterType => state.filter
export const {setFilterByFields, setStatus} = filterSlice.actions
export default filterSlice.reducer