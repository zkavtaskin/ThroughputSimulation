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
})();
//# sourceMappingURL=SequentialMovePolicy.js.map