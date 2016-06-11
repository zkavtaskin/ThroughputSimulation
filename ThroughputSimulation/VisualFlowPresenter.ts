class VisualFlowPresenter {

    onTrainMovedProxy: (train: Train) => void;
    onTrainMovedAndArrivedProxy: (train: Train) => void;
    onTrainBlockedProxy: (train: Train) => void;
    onPlayProxy: () => void;
    onStopProxy: () => void;

    continueSimulationProxy: () => void;
    ballHash: { [id: number]: BallModel } = [];
    view: VisualFlowView;
    colors: Array<string> = ["yellow", "pink", "red", "grey",
        "black", "blue", "orange", "brown", "green", "purple"];

    start: number;
    flowDistance: number;
    controlCenter: ControlCenter = null;
    movePolicy: IMovePolicy;
    intervalId: number;

    constructor(view: VisualFlowView, movePolicy: IMovePolicy, flowDistance: number) {

        this.onTrainMovedProxy = (train: Train) => {
            this.onTrainMoved.apply(this, [train]);
        };

        this.onTrainMovedAndArrivedProxy = (train: Train) => {
            this.onTrainMovedAndArrived.apply(this, [train]);
        };

        this.onTrainBlockedProxy = (train: Train) => {
            this.onTrainBlocked.apply(this, [train]);
        };

        this.continueSimulationProxy = () => {
            this.continueSimulation.apply(this);
        };

        this.onPlayProxy = () => {
            this.onPlay.apply(this);
        };

        this.onStopProxy = () => {
            this.onStop.apply(this);
        };

        this.movePolicy = movePolicy;
        this.flowDistance = flowDistance;

        this.view = view;
        this.view.AddEventPlay(this.onPlayProxy);
        this.view.AddEventStop(this.onStopProxy);
    }

    continueSimulation(): void {
        let train: Train = this.controlCenter.PutOnTrackNewTrain();
        if (train != null) {
            train.AddEventOnTrainMoved(this.onTrainMovedProxy);
            train.AddEventOnTrainMovedThenArrived(this.onTrainMovedAndArrivedProxy);
            this.onTrainAdded(train);
        }
        this.controlCenter.MoveAllTrainsOnTrack(this.movePolicy, this.onTrainBlockedProxy);
        this.view.RunAnimations();
        let stats: StatsModel = new StatsModel(
            this.controlCenter.GetAverageTrainJourneyTicks(),
            this.controlCenter.GetInterlocks(),
            this.controlCenter.GetTrainsReachedDestination(),
            performance.now() - this.start
        );
        this.view.UpdateStats(stats);
    }

    onPlay(): void {
        if (this.controlCenter == null) {
            this.controlCenter = new ControlCenter(this.flowDistance);
            this.start = performance.now();
            this.intervalId = setInterval(this.continueSimulationProxy, 100 * (this.flowDistance + 1));
        }
    }

    onStop(): void {
        clearInterval(this.intervalId);
        this.controlCenter = null;
        this.view.Reset();
        this.ballHash = [];
    }

    onTrainAdded(train: Train): void {
        this.ballHash[train.Id] =
            new BallModel(train.Id, train.Position, this.colors[Math.round(Math.random() * 10 + 1)]);
        this.view.AddBall(this.ballHash[train.Id]);
    }

    onTrainMoved(train: Train): void {
        let ball: BallModel = this.ballHash[train.Id];
        ball.position = train.Position;
        this.view.MoveBall(this.ballHash[train.Id]);
    }

    onTrainBlocked(train: Train): void {
        this.view.BlockedBall(this.ballHash[train.Id]);
    }

    onTrainMovedAndArrived(train: Train): void {
        this.view.RemoveBall(this.ballHash[train.Id]);
        this.ballHash[train.Id] = null;
        train.RemoveEventOnTrainMoved(this.onTrainMovedProxy);
        train.RemoveEventOnTrainMovedThenArrived(this.onTrainMovedAndArrivedProxy);
    }

}
