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
})();
//# sourceMappingURL=LargeStopStartMovePolicy.js.map