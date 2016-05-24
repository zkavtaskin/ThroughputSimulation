/// <reference path="Scripts/typings/jquery/jquery.d.ts" />
var StatsModel = (function () {
    function StatsModel(leadtime, interlocks, arrived, runningTime) {
        this.Leadtime = 0;
        this.Interlocks = 0;
        this.Arrived = 0;
        this.RunningTime = 0;
        this.Leadtime = leadtime;
        this.Interlocks = interlocks;
        this.Arrived = arrived;
        this.RunningTime = runningTime;
    }
    return StatsModel;
})();
//# sourceMappingURL=StatsModel.js.map