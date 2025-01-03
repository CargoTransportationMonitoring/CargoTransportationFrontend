import {createSlice, PayloadAction, Slice} from "@reduxjs/toolkit";
import {RootState} from "../store";

export type RouteType = {
    routeId: string
}

const initialState: RouteType[] = []

export const routesSlice: Slice<RouteType[]> = createSlice({
    name: 'routes',
    initialState,
    reducers: {
        addRoute: (state: RouteType[], action: PayloadAction<RouteType>): RouteType[] => {
            return [...state, action.payload]
        },
        removeRoute: (state: RouteType[], action: PayloadAction<RouteType>): RouteType[] => {
            return state.filter((route: RouteType): boolean => route.routeId !== action.payload.routeId)
        }
    }
})

export const selectRoutes = (state: RootState): RouteType[] => state.routes
export const {addRoute, removeRoute} = routesSlice.actions
export default routesSlice.reducer