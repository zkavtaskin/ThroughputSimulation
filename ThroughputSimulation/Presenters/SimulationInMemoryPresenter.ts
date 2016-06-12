class SimulationInMemoryPresenter implements ISimulationPresenter {

    start: number;
    controlCenter: ControlCenter = null;
    movePolicy: IMovePolicy;
    stopping: boolean = false;
    turnCompleteHandler: { (): void } = () => { };
    stoppedHandler: { (): void } = () => { };

    public Play(controlCenter: ControlCenter, movePolicy: IMovePolicy): void {
        if (this.controlCenter == null) {
            this.controlCenter = controlCenter;
            this.movePolicy = movePolicy;
            this.start = performance.now();
            this.continueSimulation();
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

        if (!this.stopping) {
            this.continueSimulation();
        } else {
            this.stop();
        }
    }

    stop(): void {
        this.controlCenter = null;
        this.stopping = false;
        this.stoppedHandler();
    }
}
