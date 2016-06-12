/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />

class PhysicalControlsView implements IControlsView {

    simulationViewId: string;

    onPlayProxy: { (eventObject: JQueryEventObject): void } = () => { };
    onStopProxy: { (eventObject: JQueryEventObject): void } = () => { };

    onPlayHandler: { (): void }[] = [];
    onStopHandler: { (): void }[] = [];

    constructor(simulationViewId: string) {
        this.simulationViewId = simulationViewId;

        this.onPlayProxy = (eventObject: JQueryEventObject) => {
            this.onPlay.apply(this, [eventObject])
        }

        this.onStopProxy = (eventObject: JQueryEventObject) => {
            this.onStop.apply(this, [eventObject])
        }

        $(this.simulationViewId + " #play").click(this.onPlayProxy);
        $(this.simulationViewId + " #stop").click(this.onStopProxy);
    }

    onPlay(eventObject: JQueryEventObject): void {
        this.onPlayHandler.forEach(h => h());
    }

    onStop(eventObject: JQueryEventObject): void {
        this.onStopHandler.forEach(h => h());
    }

    AddEventPlay(handler: { (): void }) {
        this.onPlayHandler.push(handler);
    }

    AddEventStop(handler: { (): void }) {
        this.onStopHandler.push(handler);
    }
}