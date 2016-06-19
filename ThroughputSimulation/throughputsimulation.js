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
var BallModel = (function () {
    function BallModel(id, position, color) {
        this.id = id;
        this.position = position;
        this.color = color;
    }
    return BallModel;
}());
var StatsModel = (function () {
    function StatsModel(name, leadtime, interlocks, arrived, runningTime) {
        this.Leadtime = 0;
        this.Interlocks = 0;
        this.Arrived = 0;
        this.RunningTime = 0;
        this.Name = name;
        this.Leadtime = leadtime;
        this.Interlocks = interlocks;
        this.Arrived = arrived;
        this.RunningTime = runningTime;
    }
    return StatsModel;
}());
var DataSeries = (function () {
    function DataSeries(label) {
        this.data = new Array();
        this.label = label;
    }
    return DataSeries;
}());
var ThroughputPresenter = (function () {
    function ThroughputPresenter(simulationPresenter, statsView, controlsView, movePolicy, flowDistance) {
        var _this = this;
        this.controlCenter = null;
        this.stopping = false;
        this.simulationPresenter = simulationPresenter;
        this.movePolicy = movePolicy;
        this.flowDistance = flowDistance;
        this.statsView = statsView;
        this.controlsView = controlsView;
        this.onPlayProxy = function () {
            _this.onPlay.apply(_this);
        };
        this.turnCompleteProxy = function () {
            _this.turnComplete.apply(_this);
        };
        this.onPlayProxy = function () {
            _this.onPlay.apply(_this);
        };
        this.stopProxy = function () {
            _this.stop.apply(_this);
        };
        this.simulationPresenter.AddEventTurnComplete(this.turnCompleteProxy);
        this.simulationPresenter.AddEventStopped(this.stopProxy);
        this.controlsView.AddEventStop(this.onStopProxy);
        this.controlsView.AddEventPlay(this.onPlayProxy);
    }
    ThroughputPresenter.prototype.turnComplete = function () {
        var stats = new StatsModel(this.movePolicy.GetName(), this.controlCenter.GetAverageTrainJourneyTicks(), this.controlCenter.GetInterlocks(), this.controlCenter.GetTrainsReachedDestination(), performance.now() - this.start);
        this.statsView.Update(stats);
    };
    ThroughputPresenter.prototype.onPlay = function () {
        if (this.controlCenter == null) {
            this.controlCenter = new ControlCenter(this.flowDistance);
            this.start = performance.now();
            this.simulationPresenter.Play(this.controlCenter, this.movePolicy);
        }
    };
    ThroughputPresenter.prototype.onStop = function () {
        this.simulationPresenter.Stop();
    };
    ThroughputPresenter.prototype.stop = function () {
        this.controlCenter = null;
        this.statsView.Clear();
    };
    return ThroughputPresenter;
}());
var SimulationInMemoryPresenter = (function () {
    function SimulationInMemoryPresenter() {
        var _this = this;
        this.controlCenter = null;
        this.stopping = false;
        this.turnCompleteHandler = function () { };
        this.stoppedHandler = function () { };
        this.continueSimulationProxy = function () {
            _this.continueSimulation.apply(_this);
        };
    }
    SimulationInMemoryPresenter.prototype.Play = function (controlCenter, movePolicy) {
        if (this.controlCenter == null) {
            this.controlCenter = controlCenter;
            this.movePolicy = movePolicy;
            this.start = performance.now();
            this.intervalId = setInterval(this.continueSimulationProxy, 200);
        }
    };
    SimulationInMemoryPresenter.prototype.Stop = function () {
        this.stopping = true;
    };
    SimulationInMemoryPresenter.prototype.AddEventTurnComplete = function (handler) {
        this.turnCompleteHandler = handler;
    };
    SimulationInMemoryPresenter.prototype.AddEventStopped = function (handler) {
        this.stoppedHandler = handler;
    };
    SimulationInMemoryPresenter.prototype.continueSimulation = function () {
        this.controlCenter.PutOnTrackNewTrain();
        this.controlCenter.MoveAllTrainsOnTrack(this.movePolicy);
        this.turnCompleteHandler();
        if (this.stopping) {
            this.stop();
        }
    };
    SimulationInMemoryPresenter.prototype.stop = function () {
        clearInterval(this.intervalId);
        this.controlCenter = null;
        this.stopping = false;
        this.stoppedHandler();
    };
    return SimulationInMemoryPresenter;
}());
var SimulationVisualPresenter = (function () {
    function SimulationVisualPresenter(flowView) {
        var _this = this;
        this.ballHash = [];
        this.colors = ["yellow", "pink", "red", "grey",
            "black", "blue", "orange", "brown", "green", "purple"];
        this.controlCenter = null;
        this.stopping = false;
        this.turnCompleteHandler = function () { };
        this.stoppedHandler = function () { };
        this.onTrainMovedProxy = function (train) {
            _this.onTrainMoved.apply(_this, [train]);
        };
        this.onTrainMovedAndArrivedProxy = function (train) {
            _this.onTrainMovedAndArrived.apply(_this, [train]);
        };
        this.onTrainBlockedProxy = function (train) {
            _this.onTrainBlocked.apply(_this, [train]);
        };
        this.flowView = flowView;
    }
    SimulationVisualPresenter.prototype.Play = function (controlCenter, movePolicy) {
        if (this.controlCenter == null) {
            this.controlCenter = controlCenter;
            this.movePolicy = movePolicy;
            this.controlCenter.AddEventOnTrainBlocked(this.onTrainBlockedProxy);
            this.start = performance.now();
            this.continueSimulation();
        }
    };
    SimulationVisualPresenter.prototype.Stop = function () {
        this.stopping = true;
    };
    SimulationVisualPresenter.prototype.AddEventTurnComplete = function (handler) {
        this.turnCompleteHandler = handler;
    };
    SimulationVisualPresenter.prototype.AddEventStopped = function (handler) {
        this.stoppedHandler = handler;
    };
    SimulationVisualPresenter.prototype.stop = function () {
        this.controlCenter = null;
        this.movePolicy = null;
        this.ballHash = [];
        this.stopping = false;
        this.flowView.Reset();
        this.stoppedHandler();
    };
    SimulationVisualPresenter.prototype.continueSimulation = function () {
        var train = this.controlCenter.PutOnTrackNewTrain();
        if (train != null) {
            train.AddEventOnTrainMoved(this.onTrainMovedProxy);
            train.AddEventOnTrainMovedThenArrived(this.onTrainMovedAndArrivedProxy);
            this.onTrainAdded(train);
        }
        this.controlCenter.MoveAllTrainsOnTrack(this.movePolicy);
        var myself = this;
        this.flowView.RunAnimations(function () {
            myself.turnCompleteHandler();
            if (!myself.stopping) {
                myself.continueSimulation();
            }
            else {
                myself.stop();
            }
        });
    };
    SimulationVisualPresenter.prototype.onTrainAdded = function (train) {
        this.ballHash[train.Id] =
            new BallModel(train.Id, train.Position, this.colors[Math.round(Math.random() * 10 + 1)]);
        this.flowView.AddBall(this.ballHash[train.Id]);
    };
    SimulationVisualPresenter.prototype.onTrainMoved = function (train) {
        var ball = this.ballHash[train.Id];
        ball.position = train.Position;
        this.flowView.MoveBall(this.ballHash[train.Id]);
    };
    SimulationVisualPresenter.prototype.onTrainBlocked = function (train) {
        this.flowView.BlockedBall(this.ballHash[train.Id]);
    };
    SimulationVisualPresenter.prototype.onTrainMovedAndArrived = function (train) {
        this.flowView.RemoveBall(this.ballHash[train.Id]);
        this.ballHash[train.Id] = null;
        train.RemoveEventOnTrainMoved(this.onTrainMovedProxy);
        train.RemoveEventOnTrainMovedThenArrived(this.onTrainMovedAndArrivedProxy);
    };
    return SimulationVisualPresenter;
}());
var VisualFlowView = (function () {
    function VisualFlowView(simulationViewId) {
        this.ballSize = 46;
        this.completionChain = new CompletionChain();
        this.simulationViewId = simulationViewId;
        $(this.simulationViewId).width(this.ballSize * 15);
    }
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
    VisualFlowView.prototype.Reset = function () {
        $(this.simulationViewId + " #simulationVisualiser").html('');
    };
    return VisualFlowView;
}());
var PhysicalControlsView = (function () {
    function PhysicalControlsView(simulationViewId) {
        var _this = this;
        this.onPlayProxy = function () { };
        this.onStopProxy = function () { };
        this.onPlayHandler = [];
        this.onStopHandler = [];
        this.simulationViewId = simulationViewId;
        this.onPlayProxy = function (eventObject) {
            _this.onPlay.apply(_this, [eventObject]);
        };
        this.onStopProxy = function (eventObject) {
            _this.onStop.apply(_this, [eventObject]);
        };
        $(this.simulationViewId + " #play").click(this.onPlayProxy);
        $(this.simulationViewId + " #stop").click(this.onStopProxy);
    }
    PhysicalControlsView.prototype.onPlay = function (eventObject) {
        this.onPlayHandler.forEach(function (h) { return h(); });
    };
    PhysicalControlsView.prototype.onStop = function (eventObject) {
        this.onStopHandler.forEach(function (h) { return h(); });
    };
    PhysicalControlsView.prototype.AddEventPlay = function (handler) {
        this.onPlayHandler.push(handler);
    };
    PhysicalControlsView.prototype.AddEventStop = function (handler) {
        this.onStopHandler.push(handler);
    };
    return PhysicalControlsView;
}());
var TextStatsView = (function () {
    function TextStatsView(simulationViewId) {
        this.simulationViewId = simulationViewId;
    }
    TextStatsView.prototype.Update = function (stats) {
        if ($(this.simulationViewId + " #simulationStatistics").length) {
            $(this.simulationViewId + " #statsLeadTime").text(Math.round(stats.Leadtime / 1000));
            $(this.simulationViewId + " #statsInterlocks").text(stats.Interlocks);
            $(this.simulationViewId + " #statsArrived").text(stats.Arrived);
            $(this.simulationViewId + " #statsRunningTime").text(Math.round(stats.RunningTime / 1000));
            $(this.simulationViewId + " #statsThroughputRate").text((stats.Arrived / (stats.RunningTime / 1000)).toPrecision(2));
        }
    };
    TextStatsView.prototype.Clear = function () {
        if ($(this.simulationViewId + " #simulationStatistics").length) {
            $(this.simulationViewId + " #statsLeadTime").text('...');
            $(this.simulationViewId + " #statsInterlocks").text('...');
            $(this.simulationViewId + " #statsArrived").text('...');
            $(this.simulationViewId + " #statsRunningTime").text('...');
            $(this.simulationViewId + " #statsThroughputRate").text('...');
        }
    };
    return TextStatsView;
}());
var AutoPlayControlsView = (function () {
    function AutoPlayControlsView() {
    }
    AutoPlayControlsView.prototype.AddEventPlay = function (handler) {
        handler();
    };
    AutoPlayControlsView.prototype.AddEventStop = function (handler) {
    };
    return AutoPlayControlsView;
}());
var ThroughputGlobalStatsView = (function () {
    function ThroughputGlobalStatsView() {
        this.iterationLastNumberMap = {};
        this.dataSeriesMap = {};
        this.keyIsAlreadyInTheStoreMap = {};
        this.keys = new Array();
    }
    ThroughputGlobalStatsView.prototype.Update = function (stats) {
        if (!this.keyIsAlreadyInTheStoreMap[stats.Name]) {
            this.keys.push(stats.Name);
            this.keyIsAlreadyInTheStoreMap[stats.Name] = true;
        }
        var index = Math.floor((stats.RunningTime / 1000 / 5));
        if (this.dataSeriesMap[stats.Name] == null) {
            this.dataSeriesMap[stats.Name] = new DataSeries(stats.Name);
        }
        if (this.dataSeriesMap[stats.Name].data[index] == null) {
            this.dataSeriesMap[stats.Name].data[index] = [index, stats.Arrived - this.iterationLastNumberMap[stats.Name]];
        }
        else {
            this.dataSeriesMap[stats.Name].data[index] =
                [index, this.dataSeriesMap[stats.Name].data[index][1] + (stats.Arrived - this.iterationLastNumberMap[stats.Name])];
        }
        this.iterationLastNumberMap[stats.Name] = stats.Arrived;
    };
    ThroughputGlobalStatsView.prototype.GetDataSeries = function () {
        var serieses = new Array();
        for (var _i = 0, _a = this.keys; _i < _a.length; _i++) {
            var key = _a[_i];
            serieses.push(this.dataSeriesMap[key]);
        }
        return serieses;
    };
    ThroughputGlobalStatsView.prototype.Clear = function () {
        this.dataSeriesMap = {};
        this.iterationLastNumberMap = {};
    };
    return ThroughputGlobalStatsView;
}());
var MultiPlexStatsView = (function () {
    function MultiPlexStatsView(statsViews) {
        this.statsViews = statsViews;
    }
    MultiPlexStatsView.prototype.Update = function (stats) {
        this.statsViews.forEach(function (view) { return view.Update(stats); });
    };
    MultiPlexStatsView.prototype.Clear = function () {
        this.statsViews.forEach(function (view) { return view.Clear(); });
    };
    return MultiPlexStatsView;
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
        this.onTrainBlockedHandler = function (train) { };
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
    ControlCenter.prototype.MoveAllTrainsOnTrack = function (movePolicy) {
        var trainCount = this.trains.length;
        for (var i = 0; i < trainCount; i++) {
            var train = this.trains.shift();
            var distanceToMove = movePolicy.GetDistance(train.Position);
            if (train.CheckIfDistanceIsClear(distanceToMove, this.positionMap)) {
                this.positionMap[train.Position] = null;
                train.Move(distanceToMove);
            }
            else {
                this.onTrainBlockedHandler(train);
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
    ControlCenter.prototype.AddEventOnTrainBlocked = function (handler) {
        this.onTrainBlockedHandler = handler;
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
    function BatchMovePolicy(emptySpaceSize) {
        this.spaceMaker = new SymmetricSpaceMaker(emptySpaceSize);
    }
    BatchMovePolicy.prototype.GetName = function () {
        return "Batch";
    };
    BatchMovePolicy.prototype.GetDistance = function (positionInTheQueue) {
        if (this.spaceMaker.CalcIfShouldSkipMoveToMakeSpace(positionInTheQueue))
            return 0;
        return Math.round((Math.random() * 10)) != 0 ? 1 : 0;
    };
    return BatchMovePolicy;
}());
var ChaosMovePolicy = (function () {
    function ChaosMovePolicy() {
    }
    ChaosMovePolicy.prototype.GetName = function () {
        return "Chaos";
    };
    ChaosMovePolicy.prototype.GetDistance = function (currentPositionInTheQueue) {
        return Math.round((Math.random() * 1)) * Math.round((Math.random() * 3) + 1);
    };
    return ChaosMovePolicy;
}());
var SinglePieceFlowMovePolicy = (function () {
    function SinglePieceFlowMovePolicy() {
    }
    SinglePieceFlowMovePolicy.prototype.GetName = function () {
        return "SinglePieceFlow";
    };
    SinglePieceFlowMovePolicy.prototype.GetDistance = function (currentPositionInTheQueue) {
        return Math.round((Math.random() * 10)) != 0 ? 1 : 0;
    };
    return SinglePieceFlowMovePolicy;
}());
var StuffJustHappensMovePolicy = (function () {
    function StuffJustHappensMovePolicy() {
    }
    StuffJustHappensMovePolicy.prototype.GetName = function () {
        return "StuffJustHappens";
    };
    StuffJustHappensMovePolicy.prototype.GetDistance = function (currentPositionInTheQueue) {
        return Math.round((Math.random() * 1));
    };
    return StuffJustHappensMovePolicy;
}());
var StuffJustHappensSlackMovePolicy = (function () {
    function StuffJustHappensSlackMovePolicy(spaceSize, groupSize) {
        this.spaceMaker = new AsymmetricSpaceMaker(spaceSize, groupSize);
    }
    StuffJustHappensSlackMovePolicy.prototype.GetName = function () {
        return "StuffJustHappensSlack";
    };
    StuffJustHappensSlackMovePolicy.prototype.GetDistance = function (positionInTheQueue) {
        if (this.spaceMaker.CalcIfShouldSkipMoveToMakeSpace(positionInTheQueue))
            return 0;
        return Math.round((Math.random() * 1));
    };
    return StuffJustHappensSlackMovePolicy;
}());
var ChaosSlackMovePolicy = (function () {
    function ChaosSlackMovePolicy(spaceSize, groupSize) {
        this.spaceMaker = new AsymmetricSpaceMaker(spaceSize, groupSize);
    }
    ChaosSlackMovePolicy.prototype.GetName = function () {
        return "ChaosSlack";
    };
    ChaosSlackMovePolicy.prototype.GetDistance = function (positionInTheQueue) {
        if (this.spaceMaker.CalcIfShouldSkipMoveToMakeSpace(positionInTheQueue))
            return 0;
        return Math.round((Math.random() * 1)) * Math.round((Math.random() * 3) + 1);
    };
    return ChaosSlackMovePolicy;
}());
var SymmetricSpaceMaker = (function () {
    function SymmetricSpaceMaker(emptySpaceSize) {
        this.emptySpaceSize = 0;
        this.totalZeroCount = 0;
        this.emptySpaceSize = emptySpaceSize;
    }
    SymmetricSpaceMaker.prototype.CalcIfShouldSkipMoveToMakeSpace = function (positionInTheQueue) {
        if (positionInTheQueue == 0) {
            if (Math.floor(this.totalZeroCount++ / this.emptySpaceSize) % 2 == 1)
                return true;
        }
        return false;
    };
    return SymmetricSpaceMaker;
}());
var AsymmetricSpaceMaker = (function () {
    function AsymmetricSpaceMaker(emptySpaceSize, groupSize) {
        this.emptySpaceSize = 0;
        this.groupSize = 0;
        this.groupAndEmptySpaceSize = 0;
        this.totalZeroCount = 0;
        this.emptySpaceSize = emptySpaceSize;
        this.groupSize = groupSize;
        this.groupAndEmptySpaceSize = this.emptySpaceSize + this.groupSize;
    }
    AsymmetricSpaceMaker.prototype.CalcIfShouldSkipMoveToMakeSpace = function (positionInTheQueue) {
        if (positionInTheQueue == 0) {
            if ((this.totalZeroCount++ % this.groupAndEmptySpaceSize) + 1 > this.groupSize)
                return true;
        }
        return false;
    };
    return AsymmetricSpaceMaker;
}());
var SinglePieceFlowSlackMovePolicy = (function () {
    function SinglePieceFlowSlackMovePolicy(spaceSize, groupSize) {
        this.spaceMaker = new AsymmetricSpaceMaker(spaceSize, groupSize);
    }
    SinglePieceFlowSlackMovePolicy.prototype.GetName = function () {
        return "SinglePieceFlowSlack";
    };
    SinglePieceFlowSlackMovePolicy.prototype.GetDistance = function (positionInTheQueue) {
        if (this.spaceMaker.CalcIfShouldSkipMoveToMakeSpace(positionInTheQueue))
            return 0;
        return Math.round((Math.random() * 10)) != 0 ? 1 : 0;
    };
    return SinglePieceFlowSlackMovePolicy;
}());
//# sourceMappingURL=throughputsimulation.js.map