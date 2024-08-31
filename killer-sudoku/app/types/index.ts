/**
 * @file     index.ts
 * @author   Zachary Wolfe (zw224021@ohio.edu)
 * @brief    The basic types for the overall app     
 * @date     August 31, 2024
 * @version  1.0
*/

export type User = {
  username: string; 
  email: string;
  photoURL?: string;
}

export type userState = {
  // is the application waiting to complete a task?
  loading: boolean;
  user?: User;
  // was there an error in the process?
  error?: Error;
}

export const initialState : userState = {
  loading: false,
}










