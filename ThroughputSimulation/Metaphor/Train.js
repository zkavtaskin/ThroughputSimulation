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
})();
//# sourceMappingURL=Train.js.map