class SimulationInMemoryPresenter implements ISimulationPresenter {

    start: number;
    controlCenter: ControlCenter = null;
    movePolicy: IMovePolicy;
    stopping: boolean = false;
    turnCompleteHandler: { (): void } = () => { };
    stoppedHandler: { (): void } = () => { };
    intervalId: number;

    continueSimulationProxy: () => void;

    constructor() {
        this.continueSimulationProxy = () => {
            this.continueSimulation.apply(this);
        };
    }

    public Play(controlCenter: ControlCenter, movePolicy: IMovePolicy): void {
        if (this.controlCenter == null) {
            this.controlCenter = controlCenter;
            this.movePolicy = movePolicy;
            this.start = performance.now();
            this.intervalId = setInterval(this.continueSimulationProxy, 200);
        }
    }

    public Stop(): void {
        this.stopping = true;
    }

    public AddEventTurnComplete(handler: { (): void }): void {
        this.turnCompleteHandler = handler;
    }

    public AddEventStopped(handler: { (): void }): void {
        this.stoppedHandler = handler;
    }

    continueSimulation(): void {
        this.controlCenter.PutOnTrackNewTrain();
        this.controlCenter.MoveAllTrainsOnTrack(this.movePolicy);

        this.turnCompleteHandler();

        if (this.stopping) {
            this.stop();
        }
    }

    stop(): void {
        clearInterval(this.intervalId);
        this.controlCenter = null;
        this.stopping = false;
        this.stoppedHandler();
    }
}
