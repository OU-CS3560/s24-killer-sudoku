const { it } = require("node:test");
import { describe, expect, jest, test } from "@jest/globals";
import { hasUncaughtExceptionCaptureCallback } from 'process';
import {timer} from './timer-test.ts';



test("Checks how many seconds have passed using advance time", () => {
    jest.useFakeTimers();

    const Time = timer();
    
    expect(Time.seconds == 0 + 's');

    jest.advanceTimersByTime(1000);

    expect(Time.seconds == 1 + 's');

    
});

test("Checks how many minutes have passed using advance Time", () => {

    jest.useFakeTimers();

    const Time = timer();

    expect(Time.minutes == 0 + ' minutes');

    jest.advanceTimersByTime(60000);

    expect(Time.minutes == 1 + ' minutes');


});

test("Checks if it resets correctly", () => {

    jest.useFakeTimers();

    const Time = timer();

    expect(Time.seconds == 0 + 's');
    expect(Time.minutes == 0 + ' minutes');

    jest.advanceTimersByTime(63000);

    expect(Time.minutes == 1 + ' minutes');
    expect(Time.seconds == 3 + 's');

    Time.reset = true;

    expect(Time.minutes == 0 + ' minutes');
    expect(Time.seconds == 0 + 's');

});