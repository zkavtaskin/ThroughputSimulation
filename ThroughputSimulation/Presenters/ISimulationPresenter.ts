interface ISimulationPresenter {
    Play(controlCenter: ControlCenter, movePolicy: IMovePolicy): void;
    AddEventTurnComplete(handler: { (): void }): void;
    AddEventStopped(handler: { (): void }): void;
    Stop(): void;
}
