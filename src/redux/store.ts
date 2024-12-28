import {configureStore} from "@reduxjs/toolkit";
import errorReducer from "./slices/ErrorSlice";
import authReducer from "./slices/AuthType";
import {AuthType} from "./slices/AuthType";

type RootReducer = {
    error: string,
    auth: AuthType
};

const store = configureStore<RootReducer>({
    reducer: {
        error: errorReducer,
        auth: authReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export default store;