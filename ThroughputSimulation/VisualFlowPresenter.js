/// <reference path="Scripts/typings/jquery/jquery.d.ts" />
var VisualFlowPresenter = (function () {
    function VisualFlowPresenter(view, movePolicy, flowDistance) {
        var _this = this;
        this.ballHash = [];
        this.colors = ["yellow", "pink", "red", "grey",
            "black", "blue", "orange", "brown", "green", "purple"];
        this.onTrainMovedProxy = function (train) {
            _this.onTrainMoved.apply(_this, [train]);
        };
        this.onTrainMovedAndArrivedProxy = function (train) {
            _this.onTrainMovedAndArrived.apply(_this, [train]);
        };
        this.onTrainBlockedProxy = function (train) {
            _this.onTrainBlocked.apply(_this, [train]);
        };
        this.continueSimulationProxy = function () {
            _this.continueSimulation.apply(_this);
        };
        this.onPlayProxy = function () {
            _this.onPlay.apply(_this);
        };
        this.onStopProxy = function () {
            _this.onStop.apply(_this);
        };
        this.movePolicy = movePolicy;
        this.flowDistance = flowDistance;
        this.view = view;
        this.view.AddEventPlay(this.onPlayProxy);
        this.view.AddEventStop(this.onStopProxy);
    }
    VisualFlowPresenter.prototype.continueSimulation = function () {
        var train = this.controlCenter.PutOnTrackNewTrain();
        if (train != null) {
            train.AddEventOnTrainMoved(this.onTrainMovedProxy);
            train.AddEventOnTrainMovedThenArrived(this.onTrainMovedAndArrivedProxy);
            this.onTrainAdded(train);
        }
        this.controlCenter.MoveAllTrainsOnTrack(this.movePolicy, this.onTrainBlockedProxy);
        this.view.RunAnimations();
        var stats = new StatsModel(this.controlCenter.GetAverageTrainJourneyTicks(), this.controlCenter.GetInterlocks(), this.controlCenter.GetTrainsReachedDestination(), performance.now() - this.start);
        this.view.UpdateStats(stats);
    };
    VisualFlowPresenter.prototype.onPlay = function () {
        this.controlCenter = new ControlCenter(this.flowDistance);
        this.start = performance.now();
        this.intervalId = setInterval(this.continueSimulationProxy, 100 * (this.flowDistance + 1));
    };
    VisualFlowPresenter.prototype.onStop = function () {
        clearInterval(this.intervalId);
        this.view.Reset();
        this.ballHash = [];
    };
    VisualFlowPresenter.prototype.onTrainAdded = function (train) {
        this.ballHash[train.Id] =
            new BallModel(train.Id, train.Position, this.colors[Math.round(Math.random() * 10 + 1)]);
        this.view.AddBall(this.ballHash[train.Id]);
    };
    VisualFlowPresenter.prototype.onTrainMoved = function (train) {
        var ball = this.ballHash[train.Id];
        ball.position = train.Position;
        this.view.MoveBall(this.ballHash[train.Id]);
    };
    VisualFlowPresenter.prototype.onTrainBlocked = function (train) {
        this.view.BlockedBall(this.ballHash[train.Id]);
    };
    VisualFlowPresenter.prototype.onTrainMovedAndArrived = function (train) {
        this.view.RemoveBall(this.ballHash[train.Id]);
        this.ballHash[train.Id] = null;
        train.RemoveEventOnTrainMoved(this.onTrainMovedProxy);
        train.RemoveEventOnTrainMovedThenArrived(this.onTrainMovedAndArrivedProxy);
    };
    return VisualFlowPresenter;
})();
//# sourceMappingURL=VisualFlowPresenter.js.map