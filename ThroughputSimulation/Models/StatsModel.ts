class StatsModel {
    Name: string;
    Leadtime: number = 0;
    Interlocks: number = 0;
    Arrived: number = 0;
    RunningTime: number = 0;

    constructor(name : string, leadtime: number,
        interlocks: number, arrived: number, runningTime: number) {
        this.Name = name;
        this.Leadtime = leadtime;
        this.Interlocks = interlocks;
        this.Arrived = arrived;
        this.RunningTime = runningTime;
    }
}
