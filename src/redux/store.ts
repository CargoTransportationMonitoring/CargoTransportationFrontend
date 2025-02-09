import {configureStore} from "@reduxjs/toolkit";
import infoTabReducer, {InfoTabType} from "./slices/InfoTabSlice";
import routeReducer from "./slices/RouteSlice";
import filterReducer from "./slices/FilterSlice";
import {RouteType} from "./slices/RouteSlice";
import {FilterType} from "./slices/FilterSlice";

type RootReducer = {
    infoTab: InfoTabType
    routes: RouteType[]
    filter: FilterType
};

const store = configureStore<RootReducer>({
    reducer: {
        infoTab: infoTabReducer,
        routes: routeReducer,
        filter: filterReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export default store;