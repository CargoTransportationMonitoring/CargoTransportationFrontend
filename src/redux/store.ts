import {configureStore} from "@reduxjs/toolkit";
import errorReducer from "./slices/ErrorSlice";
import routeReducer from "./slices/RouteSlice";
import filterReducer from "./slices/FilterSlice";
import {RouteType} from "./slices/RouteSlice";
import {FilterType} from "./slices/FilterSlice";

type RootReducer = {
    error: string
    routes: RouteType[]
    filter: FilterType
};

const store = configureStore<RootReducer>({
    reducer: {
        error: errorReducer,
        routes: routeReducer,
        filter: filterReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export default store;