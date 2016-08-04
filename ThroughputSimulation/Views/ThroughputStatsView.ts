
class ThroughputStatsView implements IStatsView {

    dataMap: HashMap<number> = {};
    keyIsAlreadyInTheStoreMap: HashMap<boolean> = {};
    keys: Array<string> = new Array<string>();

    public Update(stats: StatsModel): void {

        if (!this.keyIsAlreadyInTheStoreMap[stats.Name]) {
            this.keys.push(stats.Name);
            this.keyIsAlreadyInTheStoreMap[stats.Name] = true;
        }

        this.dataMap[stats.Name] = stats.Arrived;
    }

    public GetData() {
        let data: Array<any> = new Array<any>();
        for (var key of this.keys) {
            data.push([key, this.dataMap[key]]);
        } 

        return data;
    }

    public Clear(): void {
        this.dataMap = {};
    }
}