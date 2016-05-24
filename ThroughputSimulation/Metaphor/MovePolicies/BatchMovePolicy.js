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
})();
//# sourceMappingURL=BatchMovePolicy.js.map