import {configureStore} from "@reduxjs/toolkit";
import errorReducer from "./slices/ErrorSlice";

type RootReducer = {
    error: string
};

const store = configureStore<RootReducer>({
    reducer: {
        error: errorReducer
    }
})
export default store;