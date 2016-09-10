class ThroughputPresenter {

    onPlayProxy: () => void;
    onStopProxy: () => void;

    turnCompleteProxy: () => void;
    stopProxy: () => void;

    simulationPresenter: ISimulationPresenter;
    statsView: IStatsView;
    controlsView: IControlsView;

    start: number;
    flowDistance: number;
    controlCenter: ControlCenter = null;
    movePolicy: IMovePolicy;
    stopping: boolean = false;

    constructor(simulationPresenter: ISimulationPresenter, statsView: IStatsView,
        controlsView: IControlsView, movePolicy: IMovePolicy, flowDistance: number) {

        this.simulationPresenter = simulationPresenter;
        this.movePolicy = movePolicy;
        this.flowDistance = flowDistance;
        this.statsView = statsView;
        this.controlsView = controlsView;

        this.onPlayProxy = () => {
            this.onPlay.apply(this);
        };

        this.turnCompleteProxy = () => {
            this.turnComplete.apply(this);
        };

        this.onPlayProxy = () => {
            this.onPlay.apply(this);
        };

        this.stopProxy = () => {
            this.stop.apply(this);
        };

        this.simulationPresenter.AddEventTurnComplete(this.turnCompleteProxy);
        this.simulationPresenter.AddEventStopped(this.stopProxy);

        this.controlsView.AddEventStop(this.onStopProxy);
        this.controlsView.AddEventPlay(this.onPlayProxy);
    }

    turnComplete(): void {
        let stats: StatsModel = new StatsModel(
            this.movePolicy.GetName(),
            this.controlCenter.GetAverageTrainJourneyTicks(),
            this.controlCenter.GetInterlocks(),
            this.controlCenter.GetTrainsReachedDestination(),
            performance.now() - this.start
        );

        if (this.statsView != null) 
            this.statsView.Update(stats);
    }
    onPlay(): void {
        if (this.controlCenter == null) {
            this.controlCenter = new ControlCenter(this.flowDistance);
            this.start = performance.now();
            this.simulationPresenter.Play(this.controlCenter, this.movePolicy);
        }
    }

    onStop(): void {
        this.simulationPresenter.Stop();
    }

    stop(): void {
        this.controlCenter = null;

        if (this.statsView != null)
            this.statsView.Clear();
    }
}
