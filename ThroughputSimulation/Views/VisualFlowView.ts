/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />

class VisualFlowView {

    simulationViewId: string;
    ballSize: number = 46;

    completionChain: CompletionChain = new CompletionChain();

    constructor(simulationViewId: string) {
        this.simulationViewId = simulationViewId;

        $(this.simulationViewId).width(this.ballSize * 15);
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

    RunAnimations(callBack: { () : void }): void {
        let myself: VisualFlowView = this;
        this.completionChain.Run(() => {
            myself.completionChain.Reset();
            callBack();
        });
    }

    RemoveBall(ball: BallModel): void {
        $(this.simulationViewId + " #_" + ball.id).remove();
    }

    Reset(): void {
        $(this.simulationViewId + " #simulationVisualiser").html('');
    }
}