const { it } = require("node:test");
import { describe, expect, jest, test } from "@jest/globals";
import { hasUncaughtExceptionCaptureCallback } from 'process';
import { TimerRef } from '../Timer';



it("Checks how many seconds have passed using advance time", () => {
    jest.useFakeTimers();
    
    const timerRef = require('../Timer');
    const callback = jest.fn();


    timerRef(callback);

    //Should not be running yet
    expect(callback).not.toHaveBeenCalled();

    
})