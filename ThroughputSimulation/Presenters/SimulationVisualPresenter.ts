class SimulationVisualPresenter implements ISimulationPresenter {

    onTrainMovedProxy: (train: Train) => void;
    onTrainMovedAndArrivedProxy: (train: Train) => void;
    onTrainBlockedProxy: (train: Train) => void;

    ballHash: { [id: number]: BallModel } = [];
    flowView: VisualFlowView;
    colors: Array<string> = ["yellow", "pink", "red", "grey",
        "black", "blue", "orange", "brown", "green", "purple"];

    movePolicy: IMovePolicy;

    start: number;
    flowDistance: number;
    controlCenter: ControlCenter = null;
    stopping: boolean = false;

    turnCompleteHandler: { (): void } = () => { };
    stoppedHandler: { (): void } = () => { };

    constructor(flowView: VisualFlowView) {

        this.onTrainMovedProxy = (train: Train) => {
            this.onTrainMoved.apply(this, [train]);
        };

        this.onTrainMovedAndArrivedProxy = (train: Train) => {
            this.onTrainMovedAndArrived.apply(this, [train]);
        };

        this.onTrainBlockedProxy = (train: Train) => {
            this.onTrainBlocked.apply(this, [train]);
        };


        this.flowView = flowView;
    }

    public Play(controlCenter: ControlCenter, movePolicy: IMovePolicy): void {
        if (this.controlCenter == null) {
            this.controlCenter = controlCenter;
            this.movePolicy = movePolicy;
            this.controlCenter.AddEventOnTrainBlocked(this.onTrainBlockedProxy);
            this.start = performance.now();
            this.continueSimulation();
        }
    }

    public Stop(): void {
        this.stopping = true;
    }

    public AddEventTurnComplete(handler: { (): void }) : void {
        this.turnCompleteHandler = handler;
    }

    public AddEventStopped(handler: { (): void }): void {
        this.stoppedHandler = handler;
    }

    private stop(): void {
        this.controlCenter = null;
        this.movePolicy = null;
        this.ballHash = [];
        this.stopping = false;
        this.flowView.Reset();
        this.stoppedHandler();
    }

    continueSimulation(): void {
        let train: Train = this.controlCenter.PutOnTrackNewTrain();
        if (train != null) {
            train.AddEventOnTrainMoved(this.onTrainMovedProxy);
            train.AddEventOnTrainMovedThenArrived(this.onTrainMovedAndArrivedProxy);
            this.onTrainAdded(train);
        }
        this.controlCenter.MoveAllTrainsOnTrack(this.movePolicy);

        let myself: SimulationVisualPresenter = this;

        this.flowView.RunAnimations(function () {

            myself.turnCompleteHandler();

            if (!myself.stopping) {
                myself.continueSimulation();
            } else {
                myself.stop();
            }
        });
    }

    onTrainAdded(train: Train): void {
        this.ballHash[train.Id] =
            new BallModel(train.Id, train.Position, this.colors[Math.round(Math.random() * 10 + 1)]);
        this.flowView.AddBall(this.ballHash[train.Id]);
    }

    onTrainMoved(train: Train): void {
        let ball: BallModel = this.ballHash[train.Id];
        ball.position = train.Position;
        this.flowView.MoveBall(this.ballHash[train.Id]);
    }

    onTrainBlocked(train: Train): void {
        this.flowView.BlockedBall(this.ballHash[train.Id]);
    }

    onTrainMovedAndArrived(train: Train): void {
        this.flowView.RemoveBall(this.ballHash[train.Id]);
        this.ballHash[train.Id] = null;
        train.RemoveEventOnTrainMoved(this.onTrainMovedProxy);
        train.RemoveEventOnTrainMovedThenArrived(this.onTrainMovedAndArrivedProxy);
    }
}
