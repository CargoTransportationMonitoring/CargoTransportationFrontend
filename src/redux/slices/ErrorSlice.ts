import {createSlice, PayloadAction, Slice} from "@reduxjs/toolkit";

interface ErrorType {
    error: string;
}


const initialState: string = ''

const errorSlice: Slice<string> = createSlice({
    name: 'error',
    initialState,
    reducers: {
        setError: (state: string, action: PayloadAction): void => {
            return action.payload
        },
        clearError: (): string => {
            return ''
        }
    }
})

export const {setError, clearError} = errorSlice.actions
export const selectError = (state: ErrorType): string => state.error
export default errorSlice.reducer