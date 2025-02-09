import {createSlice, PayloadAction, Slice} from "@reduxjs/toolkit";
import {RootState} from "../store";

export type RouteType = {
    id: string
    name: string
    description: string
    assignedUsername: string
    routeStatus: "NEW" | "IN_PROGRESS" | "COMPLETED"
    pointsCount: number
}

const initialState: RouteType[] = []

export const routesSlice: Slice<RouteType[]> = createSlice({
    name: 'routes',
    initialState,
    reducers: {
        addRoute: (state: RouteType[], action: PayloadAction<RouteType>): RouteType[] => {
            const isUnique: boolean = state.find((route: RouteType): boolean => route.id === action.payload.id) === undefined
            if (isUnique)
                return [...state, action.payload]
            else {
                return state
            }
        },
        removeRoute: (state: RouteType[], action: PayloadAction<RouteType>): RouteType[] => {
            return state.filter((route: RouteType): boolean => route.id !== action.payload.id)
        },
        clearRoutes: (): RouteType[] => {
            return initialState
        },
        setRoutes: (state: RouteType[], action: PayloadAction<RouteType[]>): RouteType[] => {
            return action.payload
        }
    }
})

export const selectRoutes = (state: RootState): RouteType[] => state.routes
export const {addRoute, removeRoute, clearRoutes, setRoutes} = routesSlice.actions
export default routesSlice.reducer