
class MultiPlexStatsView implements IStatsView {

    statsViews: Array<IStatsView>;

    constructor(statsViews: Array<IStatsView>) {
        this.statsViews = statsViews;
    }

    Update(stats: StatsModel): void {
        this.statsViews.forEach(view => view.Update(stats));
    }

    Clear(): void {
        this.statsViews.forEach(view => view.Clear());
    }
}