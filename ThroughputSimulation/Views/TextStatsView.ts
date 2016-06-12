
class TextStatsView implements IStatsView {

    simulationViewId: string;

    constructor(simulationViewId: string) {
        this.simulationViewId = simulationViewId;

    }

    Update(stats: StatsModel): void {
        if ($(this.simulationViewId + " #simulationStatistics").length) {
            $(this.simulationViewId + " #statsLeadTime").text(Math.round(stats.Leadtime / 1000));
            $(this.simulationViewId + " #statsInterlocks").text(stats.Interlocks);
            $(this.simulationViewId + " #statsArrived").text(stats.Arrived);
            $(this.simulationViewId + " #statsRunningTime").text(Math.round(stats.RunningTime / 1000));
            $(this.simulationViewId + " #statsThroughputRate").text((stats.Arrived / (stats.RunningTime / 1000)).toPrecision(2));
        }

    }

    Clear(): void {
        if ($(this.simulationViewId + " #simulationStatistics").length) {
            $(this.simulationViewId + " #statsLeadTime").text('...');
            $(this.simulationViewId + " #statsInterlocks").text('...');
            $(this.simulationViewId + " #statsArrived").text('...');
            $(this.simulationViewId + " #statsRunningTime").text('...');
            $(this.simulationViewId + " #statsThroughputRate").text('...');
        }
    }
}