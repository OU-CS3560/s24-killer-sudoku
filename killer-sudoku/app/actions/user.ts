/**
 * @file     user.ts
 * @author   Zachary Wolfe (zw224021@ohio.edu)
 * @brief    The actions that the program will invoke when a user interacts with the app    
 * @date     August 31, 2024
 * @version  1.0
*/

export const GET_USER_REQ = "GET_USER_REQ"
export const GET_USER_SUC = "GET_USER_SUC"
export const GET_USER_FAIL = "GET_USER_FAIL"  

export const signInUser = (email: string, password: string) => {
  // async/await dispatch 
}

export const signOutUser = () => {
  // async/await dispatch
}

export const signUpUserReq = (email: string, password: string) => {
  // async/await dispatch
}