var ChaosStopStartMovePolicy = (function () {
    function ChaosStopStartMovePolicy() {
    }
    ChaosStopStartMovePolicy.prototype.GetDistance = function (currentPositionInTheQueue) {
        return ((Math.random() * 2) + 1) * (Math.random() * 4) + 1;
    };
    return ChaosStopStartMovePolicy;
})();
