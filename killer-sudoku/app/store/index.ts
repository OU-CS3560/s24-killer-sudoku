/**
 * @file     index.ts
 * @author   Zachary Wolfe (zw224021@ohio.edu)
 * @brief    The file that programs refer to for state 
 * @date     August 31, 2024
 * @version  1.0
*/

import { configureStore } from "@reduxjs/toolkit"
import reducers from '../reducers/index'
import { useDispatch, useSelector } from "react-redux"

// This is the store that the app will use to manage state 
export const store = configureStore({
  // This is the reducer that enables actions
  reducer: reducers
})

// The root state of the app (the state of the store)
export type RootState = ReturnType<typeof store.getState>
// The dispatch function that the store uses to dispatch actions to the reducers
export type AppDispatch = typeof store.dispatch 


// the hooks that the app will use to interact with the store
export const useAppDispatch = useDispatch.withTypes<AppDispatch>() 
export const useAppSelector = useSelector.withTypes<RootState>()