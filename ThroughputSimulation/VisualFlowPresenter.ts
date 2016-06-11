class VisualFlowPresenter {

    onTrainMovedProxy: (train: Train) => void;
    onTrainMovedAndArrivedProxy: (train: Train) => void;
    onTrainBlockedProxy: (train: Train) => void;
    onPlayProxy: () => void;
    onStopProxy: () => void;

    ballHash: { [id: number]: BallModel } = [];
    view: VisualFlowView;
    colors: Array<string> = ["yellow", "pink", "red", "grey",
        "black", "blue", "orange", "brown", "green", "purple"];

    start: number;
    flowDistance: number;
    controlCenter: ControlCenter = null;
    movePolicy: IMovePolicy;
    stopping: boolean = false;

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

        let myself: VisualFlowPresenter = this;

        this.view.RunAnimations(function () {
            let stats: StatsModel = new StatsModel(
                myself.controlCenter.GetAverageTrainJourneyTicks(),
                myself.controlCenter.GetInterlocks(),
                myself.controlCenter.GetTrainsReachedDestination(),
                performance.now() - myself.start
            );
            myself.view.UpdateStats(stats);
            if (!myself.stopping) {
                myself.continueSimulation();
            } else {
                myself.stop();
            }
        });
    }

    onPlay(): void {
        if (this.controlCenter == null) {
            this.controlCenter = new ControlCenter(this.flowDistance);
            this.start = performance.now();
            this.continueSimulation();
        }
    }

    onStop(): void {
        this.stopping = true;
    }

    stop(): void {
        this.controlCenter = null;
        this.ballHash = [];
        this.view.Reset();
        this.stopping = false;
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
