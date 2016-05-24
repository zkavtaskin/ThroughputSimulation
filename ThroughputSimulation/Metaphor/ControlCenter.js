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
})();
//# sourceMappingURL=ControlCenter.js.map