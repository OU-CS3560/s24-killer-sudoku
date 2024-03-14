/**
 * @file     Timer.tsx
 * @author   Kevin Belock (kb848020@ohio.edu)
 * @brief    An element which creates a timer to count the duration the user takes to complete the Sudoku.
 * @date     February 24, 2024
*/

"use client"; // for useState variables

import * as React from 'react';
import { useState, useImperativeHandle } from 'react';

// The interface used to create a cross reference to the Sudoku class
export interface TimerRef {
    start:      () => void;
    stop:       () => void;
    reset:      () => void;
    getRunning: () => boolean;
    getTime:    () => number;
    getMinutes: () => number;
    getSeconds: () => number;
}

/**
 * @brief A function that returns a timer and all of its corresponding functions
 * @returns A div with a timer in the format {minutes} : {seconds}
 * Needs to be forward referenced so that './Sudoku.tsx' knows that it's waiting on an element that might not yet exist
 */
const Timer = React.forwardRef<TimerRef>((props, ref) => {

    // Binds the number time to a function setTime with the value of zero.
    const [time, setTime] = useState(0);

    // Binds the boolean isRunning to a function setIsRunning with the value of false.
    const [isRunning, setIsRunning] = useState(false);

    const start = () => {
        setIsRunning(true);
    };
    const stop = () => {
        setIsRunning(false);
    }
    const reset = () => {
        stop();
        setTime(0);
    };
    const getRunning = () => {
        return isRunning;
    }
    const getTime = () => {
        return time;
    }
    const getMinutes = () => {
        return minutes;
    }
    const getSeconds = () => {
        return seconds;
    }

    React.useEffect(() => {
        let internalid: string | number | NodeJS.Timeout | undefined;

        if(isRunning){
            //sets the time from 0 to 1 every second through javascript interval method
            internalid = setInterval(() => setTime(time + 1), 1000);
        }
        return () => clearInterval(internalid);
    }, [isRunning, time]);

    // To link the startStop and reset functions to be usable outside of this element.
    useImperativeHandle(ref, () => ({
        start,
        stop,
        reset,
        getRunning,
        getTime,
        getMinutes,
        getSeconds,
    }));

    // Converts time to seconds
    const seconds = time % 60;
    // Converts time to minutes
    const minutes = Math.floor((time / 60));
    
    let secondsString = seconds.toString();
    let minutesString = minutes.toString();

    if (seconds < 10){
        secondsString = '0' + secondsString;
    }
    if (minutes < 10){
        minutesString = '0' + minutesString;
    }

    return (
        <div className='timer'>
            {minutesString}:{secondsString}
        </div>
    );
});

Timer.displayName = 'Timer'; // For whatever reason, ESLint complains about an element not having a displayName when using the ImperativeHandle
export default Timer;