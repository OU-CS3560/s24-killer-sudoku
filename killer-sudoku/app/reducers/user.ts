/**
 * @file     user.ts
 * @author   Zachary Wolfe (zw224021@ohio.edu)
 * @brief    The reducer that the store will mainly refer to to manage the user       
 * @date     August 31, 2024
 * @version  1.0
*/

import { UnknownAction } from "@reduxjs/toolkit"
import * as user from '../actions/user'
import { initialState, userState, User } from "../types"

export default (state = initialState, action: UnknownAction) => {
  switch (action.type) {
    case "GET_USER_REQ":
      return {
        ...state,
        loading: true,
        error: undefined
      }
    case "GET_USER_SUC":
      return {
        ...state,
        loading: false,
        user: action.payload as User,
        error: undefined
      }
    case "GET_USER_FAIL":
      return {
        ...state,
        loading: false,
        error: action.payload as Error
      }
    default:
      return state
  }
}
