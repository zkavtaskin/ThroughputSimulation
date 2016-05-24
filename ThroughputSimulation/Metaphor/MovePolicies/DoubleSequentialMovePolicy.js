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
})();
//# sourceMappingURL=DoubleSequentialMovePolicy.js.map