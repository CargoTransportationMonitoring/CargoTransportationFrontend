import {createSlice, PayloadAction, Slice} from "@reduxjs/toolkit";
import {RootState} from "../store";

export type FilterType = {
    username: string
}

const initialState: FilterType = {username: ""}

export const filterSlice: Slice<FilterType> = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setFilter: (state: FilterType, action: PayloadAction<FilterType>): FilterType => {
            return action.payload
        }
    }
})

export const selectFilter = (state: RootState): FilterType => state.filter
export const {setFilter} = filterSlice.actions
export default filterSlice.reducer