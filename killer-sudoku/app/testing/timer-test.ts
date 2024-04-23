/**
 * @file     timer-test.ts
 * @author   Kevin Belock (kb848020@ohio.edu)
 * @brief    The non-react version of the timer code for the unit tests
 * @date     April 22, 2024
*/

/**
 * @brief A function that returns a timer and all of its corresponding functions
 * @returns The timers seconds and minuets to be checked by the unit tests
 */

export function timer() {

/**
 * @brief Starts the timer when it is first initiated.
 */

    let timeStart = new Date().getTime();
    return {

        /**
         * @brief Returns the seconds the timer has counted since it started
         * @returns Timer seconds calculated from miliseconds
         * 
        */

        get seconds(){
            const seconds = Math.floor(((new Date().getTime() - timeStart) / 1000) % 60) + 's';
            return seconds;
        },

         /**
         * @brief Returns the minutes the timer has counted since it started
         * @returns Timer minutes calculated from miliseconds
         * 
        */

        get minutes(){

            const minutes = Math.floor((new Date().getTime() - timeStart ) / 60000) + ' minutes';
            return minutes;
            

        },

         /**
         * @brief Restarts the timer to zero when given a true value
         * @param value If true then it restarts the timer to zero seconds and zero minuets
         * @returns Timer seconds calculated from miliseconds
         * 
        */

        set reset(value: boolean){

            if(value){

                timeStart = new Date().getTime();

            }
            

        }

    }

}