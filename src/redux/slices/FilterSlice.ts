import {createSlice, PayloadAction, Slice} from "@reduxjs/toolkit";
import {RootState} from "../store";

export type FilterType = {
    username: string,
    routeStatus: string
}

const initialState: FilterType = {username: "", routeStatus: ""}

export const filterSlice: Slice<FilterType> = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilter: (state: FilterType, action: PayloadAction<FilterType>): FilterType => {
            return action.payload
        },
        setStatus: (state: FilterType, action: PayloadAction<string>): FilterType => {
            return {...state, routeStatus: action.payload}
        }
    }
})

export const selectFilter = (state: RootState): FilterType => state.filter
export const {setFilter, setStatus} = filterSlice.actions
export default filterSlice.reducer