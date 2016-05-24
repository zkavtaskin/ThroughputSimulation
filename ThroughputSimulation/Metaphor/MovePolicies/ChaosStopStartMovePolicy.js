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
})();
//# sourceMappingURL=ChaosStopStartMovePolicy.js.map