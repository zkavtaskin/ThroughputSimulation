/// <reference path="Scripts/typings/jquery/jquery.d.ts" />

class VisualFlowView {

    simulationViewId: string;
    ballSize: number = 46;

    completionChain: CompletionChain = new CompletionChain();

    onPlayProxy: { (eventObject: JQueryEventObject): void } = () => { };
    onStopProxy: { (eventObject: JQueryEventObject): void } = () => { };

    onPlayHandler: { (): void } = () => { };
    onStopHandler: { (): void } = () => { };

    constructor(simulationViewId: string) {
        this.simulationViewId = simulationViewId;

        $(this.simulationViewId).width(this.ballSize * 15);

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
        this.onPlayHandler();
    }

    onStop(eventObject: JQueryEventObject): void {
        this.onStopHandler();
    }

    AddEventPlay(handler: { (): void }) {
        this.onPlayHandler = handler;
    }

    AddEventStop(handler: { (): void }) {
        this.onStopHandler = handler;
    }

    AddBall(ball: BallModel): void {
        let ballString: string =
            '<div id="_' + ball.id +
            '" class="ball" style="left:0px;background:' + ball.color +
            '">' + ball.id.toString().substring(0, 4) + '</div>';

        $(this.simulationViewId + " #simulationVisualiser").append(ballString);
    }

    MoveBall(ball: BallModel): void {
        let myself: VisualFlowView = this;
        this.completionChain.Add((completed: { () : void }) => {
            $(this.simulationViewId + " #_" + ball.id).animate(
                {
                    left: (ball.position * myself.ballSize) + "px"
                },
                {
                    duration: 100,
                    complete: completed
                });
        });
    }

    BlockedBall(ball: BallModel): void {
        this.completionChain.Add((completed: { (): void }) => {
            $(this.simulationViewId + " #_" + ball.id)
                .fadeOut(50)
                .fadeIn(50, completed);
        });

    }

    RunAnimations(): void {
        let myself: VisualFlowView = this;
        this.completionChain.Run(() => {
            myself.completionChain.Reset();
        });
    }

    RemoveBall(ball: BallModel): void {
        $(this.simulationViewId + " #_" + ball.id).remove();
    }

    UpdateStats(stats: StatsModel): void {
        if ($(this.simulationViewId + " #simulationStatistics").length) {
            $(this.simulationViewId + " #statsLeadTime").text(Math.round(stats.Leadtime / 1000));
            $(this.simulationViewId + " #statsInterlocks").text(stats.Interlocks);
            $(this.simulationViewId + " #statsArrived").text(stats.Arrived);
            $(this.simulationViewId + " #statsRunningTime").text(Math.round(stats.RunningTime / 1000));
            $(this.simulationViewId + " #statsThroughputRate").text((stats.Arrived / (stats.RunningTime / 1000)).toPrecision(2));
        }
    }

    Reset(): void {
        if ($(this.simulationViewId + " #simulationStatistics").length) {
            $(this.simulationViewId + " #simulationVisualiser").html('');
            $(this.simulationViewId + " #statsLeadTime").text('...');
            $(this.simulationViewId + " #statsInterlocks").text('...');
            $(this.simulationViewId + " #statsArrived").text('...');
            $(this.simulationViewId + " #statsRunningTime").text('...');
            $(this.simulationViewId + " #statsThroughputRate").text('...');
        }
    }
}