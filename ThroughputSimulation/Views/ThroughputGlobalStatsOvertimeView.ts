
class ThroughputGlobalStatsOvertimeView implements IStatsView {

    iterationLastNumberMap: HashMap<number> = {};
    dataSeriesMap: HashMap<DataSeries> = {};
    keyIsAlreadyInTheStoreMap: HashMap<boolean> = {};
    keys: Array<string> = new Array<string>();

    public Update(stats: StatsModel): void {

        if (!this.keyIsAlreadyInTheStoreMap[stats.Name]) {
            this.keys.push(stats.Name);
            this.keyIsAlreadyInTheStoreMap[stats.Name] = true;
        }

        let index: number = Math.floor((stats.RunningTime / 1000 / 5));

        if (this.dataSeriesMap[stats.Name] == null) {
            this.dataSeriesMap[stats.Name] = new DataSeries(stats.Name);
        }

        if (this.dataSeriesMap[stats.Name].data[index] == null) {
            this.dataSeriesMap[stats.Name].data[index] = [index, stats.Arrived - this.iterationLastNumberMap[stats.Name]];
        } else {
            this.dataSeriesMap[stats.Name].data[index] =
                [index, this.dataSeriesMap[stats.Name].data[index][1] + (stats.Arrived - this.iterationLastNumberMap[stats.Name])];
        }
        this.iterationLastNumberMap[stats.Name] = stats.Arrived;
    }

    public GetDataSeries() {
        let serieses: Array<DataSeries> = new Array<DataSeries>();
        for (var key of this.keys) {
            serieses.push(this.dataSeriesMap[key]);
        } 
        return serieses;
    }

    public Clear(): void {
        this.dataSeriesMap = {};
        this.iterationLastNumberMap = {};
    }
}