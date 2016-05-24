/// <reference path="Scripts/typings/jquery/jquery.d.ts" />
var VisualFlowView = (function () {
    function VisualFlowView(simulationViewId) {
        var _this = this;
        this.ballSize = 46;
        this.animationStack = [];
        this.animationCounter = 0;
        this.onPlayProxy = function () { };
        this.onStopProxy = function () { };
        this.onPlayHandler = function () { };
        this.onStopHandler = function () { };
        this.simulationViewId = simulationViewId;
        $(this.simulationViewId).width(this.ballSize * 15);
        this.onPlayProxy = function (eventObject) {
            _this.onPlay.apply(_this, [eventObject]);
        };
        this.onStopProxy = function (eventObject) {
            _this.onStop.apply(_this, [eventObject]);
        };
        $(this.simulationViewId + " #play").click(this.onPlayProxy);
        $(this.simulationViewId + " #stop").click(this.onStopProxy);
    }
    VisualFlowView.prototype.onPlay = function (eventObject) {
        this.onPlayHandler();
    };
    VisualFlowView.prototype.onStop = function (eventObject) {
        this.onStopHandler();
    };
    VisualFlowView.prototype.AddEventPlay = function (handler) {
        this.onPlayHandler = handler;
    };
    VisualFlowView.prototype.AddEventStop = function (handler) {
        this.onStopHandler = handler;
    };
    VisualFlowView.prototype.AddBall = function (ball) {
        var ballString = '<div id="_' + ball.id +
            '" class="ball" style="left:0px;background:' + ball.color +
            '">' + ball.id.toString().substring(0, 4) + '</div>';
        $(this.simulationViewId + " #simulationVisualiser").append(ballString);
    };
    VisualFlowView.prototype.MoveBall = function (ball) {
        var _this = this;
        var animationIndex = this.animationCounter;
        var myself = this;
        this.animationStack[animationIndex] = function () {
            $(_this.simulationViewId + " #_" + ball.id).animate({
                left: (ball.position * myself.ballSize) + "px"
            }, {
                duration: 100,
                complete: function () {
                    myself.animationChain(++animationIndex);
                }
            });
        };
        this.animationCounter++;
    };
    VisualFlowView.prototype.BlockedBall = function (ball) {
        var _this = this;
        var animationIndex = this.animationCounter;
        var myself = this;
        this.animationStack[animationIndex] = function () {
            $(_this.simulationViewId + " #_" + ball.id)
                .fadeOut(50)
                .fadeIn(50, function () {
                myself.animationChain(++animationIndex);
            });
        };
        this.animationCounter++;
    };
    VisualFlowView.prototype.RunAnimations = function () {
        if (this.animationStack[0] != null) {
            this.animationStack[0]();
        }
    };
    VisualFlowView.prototype.RemoveBall = function (ball) {
        $(this.simulationViewId + " #_" + ball.id).remove();
    };
    VisualFlowView.prototype.UpdateStats = function (stats) {
        $(this.simulationViewId + " #statsLeadTime").text(Math.round(stats.Leadtime / 1000));
        $(this.simulationViewId + " #statsInterlocks").text(stats.Interlocks);
        $(this.simulationViewId + " #statsArrived").text(stats.Arrived);
        $(this.simulationViewId + " #statsRunningTime").text(Math.round(stats.RunningTime / 1000));
        $(this.simulationViewId + " #statsThroughputRate").text((stats.Arrived / (stats.RunningTime / 1000)).toPrecision(2));
    };
    VisualFlowView.prototype.Reset = function () {
        $(this.simulationViewId + " #simulationVisualiser").html('');
        $(this.simulationViewId + " #statsLeadTime").text('...');
        $(this.simulationViewId + " #statsInterlocks").text('...');
        $(this.simulationViewId + " #statsArrived").text('...');
        $(this.simulationViewId + " #statsRunningTime").text('...');
        $(this.simulationViewId + " #statsThroughputRate").text('...');
    };
    VisualFlowView.prototype.animationChain = function (index) {
        if (this.animationStack[index] != null) {
            this.animationStack[index]();
        }
        else {
            this.animationStack = [];
            this.animationCounter = 0;
        }
    };
    return VisualFlowView;
})();
//# sourceMappingURL=VisualFlowView.js.map