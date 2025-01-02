import {configureStore} from "@reduxjs/toolkit";
import errorReducer from "./slices/ErrorSlice";
import routeReducer from "./slices/RouteSlice";
import {RouteType} from "./slices/RouteSlice";

type RootReducer = {
    error: string
    routes: RouteType[]
};

const store = configureStore<RootReducer>({
    reducer: {
        error: errorReducer,
        routes: routeReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export default store;