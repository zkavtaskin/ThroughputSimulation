var BallModel = (function () {
    function BallModel(id, position, color) {
        this.id = id;
        this.position = position;
        this.color = color;
    }
    return BallModel;
}());
var CompletionChain = (function () {
    function CompletionChain() {
        this.chainIndex = 0;
        this.chainList = new Array();
        this.onChainComplete = function () { };
    }
    CompletionChain.prototype.Add = function (funcToComplete) {
        var myself = this;
        this.chainList.push(function () {
            funcToComplete(function () {
                myself.chainIndex++;
                myself.execNextFuncInTheChain(myself.chainIndex);
            });
        });
        return this;
    };
    CompletionChain.prototype.Run = function (callBack) {
        if (callBack != null)
            this.onChainComplete = callBack;
        this.execNextFuncInTheChain(0);
    };
    CompletionChain.prototype.Reset = function () {
        this.chainIndex = 0;
        this.chainList = new Array();
        this.onChainComplete = function () { };
    };
    CompletionChain.prototype.execNextFuncInTheChain = function (index) {
        if (this.chainList[index] != null) {
            this.chainList[index]();
        }
        else {
            this.onChainComplete();
        }
    };
    return CompletionChain;
}());
var VisualFlowPresenter = (function () {
    function VisualFlowPresenter(view, movePolicy, flowDistance) {
        var _this = this;
        this.ballHash = [];
        this.colors = ["yellow", "pink", "red", "grey",
            "black", "blue", "orange", "brown", "green", "purple"];
        this.controlCenter = null;
        this.stopping = false;
        this.onTrainMovedProxy = function (train) {
            _this.onTrainMoved.apply(_this, [train]);
        };
        this.onTrainMovedAndArrivedProxy = function (train) {
            _this.onTrainMovedAndArrived.apply(_this, [train]);
        };
        this.onTrainBlockedProxy = function (train) {
            _this.onTrainBlocked.apply(_this, [train]);
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
        var myself = this;
        this.view.RunAnimations(function () {
            var stats = new StatsModel(myself.controlCenter.GetAverageTrainJourneyTicks(), myself.controlCenter.GetInterlocks(), myself.controlCenter.GetTrainsReachedDestination(), performance.now() - myself.start);
            myself.view.UpdateStats(stats);
            if (!myself.stopping) {
                myself.continueSimulation();
            }
            else {
                myself.stop();
            }
        });
    };
    VisualFlowPresenter.prototype.onPlay = function () {
        if (this.controlCenter == null) {
            this.controlCenter = new ControlCenter(this.flowDistance);
            this.start = performance.now();
            this.continueSimulation();
        }
    };
    VisualFlowPresenter.prototype.onStop = function () {
        this.stopping = true;
    };
    VisualFlowPresenter.prototype.stop = function () {
        this.controlCenter = null;
        this.ballHash = [];
        this.view.Reset();
        this.stopping = false;
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
}());
var VisualFlowView = (function () {
    function VisualFlowView(simulationViewId) {
        var _this = this;
        this.ballSize = 46;
        this.completionChain = new CompletionChain();
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
        var myself = this;
        this.completionChain.Add(function (completed) {
            $(_this.simulationViewId + " #_" + ball.id).animate({
                left: (ball.position * myself.ballSize) + "px"
            }, {
                duration: 100,
                complete: completed
            });
        });
    };
    VisualFlowView.prototype.BlockedBall = function (ball) {
        var _this = this;
        this.completionChain.Add(function (completed) {
            $(_this.simulationViewId + " #_" + ball.id)
                .fadeOut(50)
                .fadeIn(50, completed);
        });
    };
    VisualFlowView.prototype.RunAnimations = function (callBack) {
        var myself = this;
        this.completionChain.Run(function () {
            myself.completionChain.Reset();
            callBack();
        });
    };
    VisualFlowView.prototype.RemoveBall = function (ball) {
        $(this.simulationViewId + " #_" + ball.id).remove();
    };
    VisualFlowView.prototype.UpdateStats = function (stats) {
        if ($(this.simulationViewId + " #simulationStatistics").length) {
            $(this.simulationViewId + " #statsLeadTime").text(Math.round(stats.Leadtime / 1000));
            $(this.simulationViewId + " #statsInterlocks").text(stats.Interlocks);
            $(this.simulationViewId + " #statsArrived").text(stats.Arrived);
            $(this.simulationViewId + " #statsRunningTime").text(Math.round(stats.RunningTime / 1000));
            $(this.simulationViewId + " #statsThroughputRate").text((stats.Arrived / (stats.RunningTime / 1000)).toPrecision(2));
        }
    };
    VisualFlowView.prototype.Reset = function () {
        if ($(this.simulationViewId + " #simulationStatistics").length) {
            $(this.simulationViewId + " #simulationVisualiser").html('');
            $(this.simulationViewId + " #statsLeadTime").text('...');
            $(this.simulationViewId + " #statsInterlocks").text('...');
            $(this.simulationViewId + " #statsArrived").text('...');
            $(this.simulationViewId + " #statsRunningTime").text('...');
            $(this.simulationViewId + " #statsThroughputRate").text('...');
        }
    };
    return VisualFlowView;
}());
var StatsModel = (function () {
    function StatsModel(leadtime, interlocks, arrived, runningTime) {
        this.Leadtime = 0;
        this.Interlocks = 0;
        this.Arrived = 0;
        this.RunningTime = 0;
        this.Leadtime = leadtime;
        this.Interlocks = interlocks;
        this.Arrived = arrived;
        this.RunningTime = runningTime;
    }
    return StatsModel;
}());
var Train = (function () {
    function Train(trackDistance) {
        this.finalDestinationPosition = 0;
        this.Position = 0;
        this.onTrainMovedHandlers = [];
        this.onTrainMovedAndThenArrivedHandlers = [];
        this.Id = Math.round(Math.random() * 1000000);
        this.finalDestinationPosition = trackDistance;
        this.journeyStart = performance.now();
    }
    Train.prototype.Move = function (distanceToMove) {
        var _this = this;
        var newPosition = this.Position + distanceToMove;
        if (newPosition >= this.finalDestinationPosition) {
            this.Position = this.finalDestinationPosition;
            this.journeyEnd = performance.now();
            this.onTrainMovedAndThenArrivedHandlers.forEach(function (h) { return h(_this); });
        }
        else {
            this.Position += distanceToMove;
            this.onTrainMovedHandlers.forEach(function (h) { return h(_this); });
        }
    };
    Train.prototype.CheckIfDistanceIsClear = function (distanceToMove, positionMap) {
        var trainInFrontFound = false;
        for (var k = 1; k <= distanceToMove && !trainInFrontFound; k++) {
            trainInFrontFound = positionMap[this.Position + k] != null;
            if (trainInFrontFound)
                return false;
        }
        return true;
    };
    Train.prototype.GetElapsedTicks = function () {
        return this.journeyEnd - this.journeyStart;
    };
    Train.prototype.AddEventOnTrainMoved = function (handler) {
        this.onTrainMovedHandlers.push(handler);
    };
    Train.prototype.RemoveEventOnTrainMoved = function (handler) {
        this.onTrainMovedHandlers = this.onTrainMovedHandlers.filter(function (h) { return h != handler; });
    };
    Train.prototype.AddEventOnTrainMovedThenArrived = function (handler) {
        this.onTrainMovedAndThenArrivedHandlers.push(handler);
    };
    Train.prototype.RemoveEventOnTrainMovedThenArrived = function (handler) {
        this.onTrainMovedAndThenArrivedHandlers =
            this.onTrainMovedAndThenArrivedHandlers.filter(function (h) { return h != handler; });
    };
    return Train;
}());
var ControlCenter = (function () {
    function ControlCenter(trackDistance) {
        var _this = this;
        this.interlockCount = 0;
        this.trainsReachedDestination = 0;
        this.positionMap = {};
        this.trains = [];
        this.totalTicks = 0;
        this.trackDistance = 0;
        this.trackDistance = trackDistance;
        this.onTrainMovedProxy = function (train) {
            _this.onTrainMoved.apply(_this, [train]);
        };
        this.onTrainMovedAndArrivedProxy = function (train) {
            _this.onTrainMovedAndArrived.apply(_this, [train]);
        };
    }
    ControlCenter.prototype.PutOnTrackNewTrain = function () {
        var train = new Train(this.trackDistance);
        if (this.positionMap[train.Position] == null) {
            train.AddEventOnTrainMoved(this.onTrainMovedProxy);
            train.AddEventOnTrainMovedThenArrived(this.onTrainMovedAndArrivedProxy);
            this.positionMap[train.Position] = train;
            this.trains.push(train);
            return train;
        }
        return null;
    };
    ControlCenter.prototype.MoveAllTrainsOnTrack = function (movePolicy, onTrainBlocked) {
        var trainCount = this.trains.length;
        for (var i = 0; i < trainCount; i++) {
            var train = this.trains.shift();
            var distanceToMove = movePolicy.GetDistance(train.Position);
            if (train.CheckIfDistanceIsClear(distanceToMove, this.positionMap)) {
                this.positionMap[train.Position] = null;
                train.Move(distanceToMove);
            }
            else {
                onTrainBlocked(train);
                this.trains.push(train);
                this.interlockCount++;
            }
        }
    };
    ControlCenter.prototype.onTrainMoved = function (train) {
        this.positionMap[train.Position] = train;
        this.trains.push(train);
    };
    ControlCenter.prototype.onTrainMovedAndArrived = function (train) {
        this.totalTicks += train.GetElapsedTicks();
        this.trainsReachedDestination++;
        train.RemoveEventOnTrainMoved(this.onTrainMovedProxy);
        train.RemoveEventOnTrainMovedThenArrived(this.onTrainMovedAndArrivedProxy);
    };
    ControlCenter.prototype.GetTrainsOnTrackCount = function () {
        return this.trains.length;
    };
    ControlCenter.prototype.GetInterlocks = function () {
        return this.interlockCount;
    };
    ControlCenter.prototype.GetTrainsReachedDestination = function () {
        return this.trainsReachedDestination;
    };
    ControlCenter.prototype.GetAverageTrainJourneyTicks = function () {
        return this.totalTicks / this.trainsReachedDestination;
    };
    return ControlCenter;
}());
var BatchMovePolicy = (function () {
    function BatchMovePolicy(distance, numberOfGroups) {
        this.numToSkip = 0;
        this.totalZeroCount = 0;
        this.numToSkip = Math.round(distance / numberOfGroups);
    }
    BatchMovePolicy.prototype.GetName = function () {
        return "BatchMovePolicy";
    };
    BatchMovePolicy.prototype.GetDistance = function (currentPositionInTheQueue) {
        if (currentPositionInTheQueue == 0) {
            var isOdd = Math.floor(this.totalZeroCount / this.numToSkip) % 2 == 1;
            this.totalZeroCount++;
            if (isOdd)
                return 0;
        }
        return 1;
    };
    return BatchMovePolicy;
}());
var ChaosStopStartMovePolicy = (function () {
    function ChaosStopStartMovePolicy() {
    }
    ChaosStopStartMovePolicy.prototype.GetName = function () {
        return "ChaosStopStartMovePolicy";
    };
    ChaosStopStartMovePolicy.prototype.GetDistance = function (currentPositionInTheQueue) {
        return Math.round((Math.random() * 1)) * Math.round((Math.random() * 3) + 1);
    };
    return ChaosStopStartMovePolicy;
}());
var DoubleSequentialMovePolicy = (function () {
    function DoubleSequentialMovePolicy() {
    }
    DoubleSequentialMovePolicy.prototype.GetName = function () {
        return "DoubleSequentialMovePolicy";
    };
    DoubleSequentialMovePolicy.prototype.GetDistance = function (currentPositionInTheQueue) {
        return 2;
    };
    return DoubleSequentialMovePolicy;
}());
var LargeStopStartMovePolicy = (function () {
    function LargeStopStartMovePolicy() {
    }
    LargeStopStartMovePolicy.prototype.GetName = function () {
        return "LargeStopStartMovePolicy";
    };
    LargeStopStartMovePolicy.prototype.GetDistance = function (currentPositionInTheQueue) {
        return Math.round((Math.random() * 1)) * 3;
    };
    return LargeStopStartMovePolicy;
}());
var MediumStopStartMovePolicy = (function () {
    function MediumStopStartMovePolicy() {
    }
    MediumStopStartMovePolicy.prototype.GetName = function () {
        return "MediumStopStartMovePolicy";
    };
    MediumStopStartMovePolicy.prototype.GetDistance = function (currentPositionInTheQueue) {
        return Math.round((Math.random() * 1)) * 2;
    };
    return MediumStopStartMovePolicy;
}());
var SequentialMovePolicy = (function () {
    function SequentialMovePolicy() {
    }
    SequentialMovePolicy.prototype.GetName = function () {
        return "SequentialMovePolicy";
    };
    SequentialMovePolicy.prototype.GetDistance = function (currentPositionInTheQueue) {
        return 1;
    };
    return SequentialMovePolicy;
}());
var TinyStopStartMovePolicy = (function () {
    function TinyStopStartMovePolicy() {
    }
    TinyStopStartMovePolicy.prototype.GetName = function () {
        return "TinyStopStartMovePolicy";
    };
    TinyStopStartMovePolicy.prototype.GetDistance = function (currentPositionInTheQueue) {
        return Math.round((Math.random() * 1));
    };
    return TinyStopStartMovePolicy;
}());
//# sourceMappingURL=throughputsimulation.js.map