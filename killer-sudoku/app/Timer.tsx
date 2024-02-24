/**
 * @file     Timer.tsx
 * @author   Kevin Belock (kb848020@ohio.edu)
 * @brief    An element which creates a timer for how long you have left to complete the suduko
 * @date     February 24, 2024
 * @version  1.0
*/

import React from 'react';

import { useState } from 'react';

const Timer = () => {

    const [minuets, setMinuets] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const start = 3600;

    const getTime = () => {
        
        setMinuets(Math.floor((start / 60) % 60));
        setSeconds(Math.floor(start % 60));

    }

    

};




