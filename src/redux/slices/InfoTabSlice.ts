import {createSlice, PayloadAction, Slice} from "@reduxjs/toolkit";
import {RootState} from "../store";

export interface InfoTabType {
    error: string;
    info: string;
    warn: string;
}

const initialState: InfoTabType = {
    error: '',
    info: '',
    warn: ''
}

const infoTabSlice: Slice<InfoTabType> = createSlice({
    name: 'infoTab',
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<string>): void => {
            state.error = action.payload;
        },
        clearError: (state): void => {
            state.error = '';
        },
        setWarn: (state, action: PayloadAction<string>): void => {
            state.warn = action.payload;
        },
        clearWarn: (state): void => {
            state.warn = '';
        },
        setInfo: (state, action: PayloadAction<string>): void => {
            state.info = action.payload;
        },
        clearInfo: (state): void => {
            state.info = '';
        }
    }
})

export const {setError, clearError, setWarn, clearWarn, setInfo, clearInfo} = infoTabSlice.actions
export const selectError = (state: RootState): string => state.infoTab.error
export const selectInfo = (state: RootState): string => state.infoTab.info
export const selectWarn = (state: RootState): string => state.infoTab.warn
export default infoTabSlice.reducer