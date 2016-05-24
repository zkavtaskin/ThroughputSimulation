/// <reference path="Scripts/typings/jquery/jquery.d.ts" />

class StatsModel {
    Leadtime: number = 0;
    Interlocks: number = 0;
    Arrived: number = 0;
    RunningTime: number = 0;

    constructor(leadtime: number,
        interlocks: number, arrived: number, runningTime : number) {
        this.Leadtime = leadtime;
        this.Interlocks = interlocks;
        this.Arrived = arrived;
        this.RunningTime = runningTime;
    }
}
