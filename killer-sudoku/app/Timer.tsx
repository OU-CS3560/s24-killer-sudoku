/**
 * @file     Timer.tsx
 * @author   Kevin Belock (kb848020@ohio.edu)
 * @brief    An element which creates a timer for how long you have left to complete the suduko
 * @date     February 24, 2024
 * @version  1.0
*/

import * as React from 'react';

import { useState } from 'react';

const Timer = () => {

    //sets time to 0 
    
    const [time, setTime] = useState(0);


    //Checks for if the timer is running
    const [isRunning, setIsRunning] = useState(false);

    React.useEffect(() => {

        let internalid: string | number | NodeJS.Timeout | undefined;

        if(isRunning){
            //sets the time from 0 to 1 every second through javascript interval method
            internalid = setInterval(() => setTime(time + 1), 1000);

        }

        return () => clearInterval(internalid);

    }, [isRunning, time]);

    //puts time in seconds

    const seconds = time;

    //calculates minuets from seconds

    const minuets = Math.floor(time / 60);

    //Whether to start or stop the timer

    const startStop = () => {
        setIsRunning(!isRunning);
    };

    const reset = () => {
        setTime(0);
    };

    

};


export default Timer;




