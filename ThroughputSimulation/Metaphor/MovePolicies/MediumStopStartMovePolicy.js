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
})();
//# sourceMappingURL=MediumStopStartMovePolicy.js.map