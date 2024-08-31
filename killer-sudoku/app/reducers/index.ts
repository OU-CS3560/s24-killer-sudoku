/**
 * @file     index.ts
 * @author   Zachary Wolfe (zw224021@ohio.edu)
 * @brief    The file the the store refers to for the default reducer 
 * @date     August 31, 2024
 * @version  1.0
*/

import { combineReducers } from "@reduxjs/toolkit"
import user from './user'

export default combineReducers({
  user
})