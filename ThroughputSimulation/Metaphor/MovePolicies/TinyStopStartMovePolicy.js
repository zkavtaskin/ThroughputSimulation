var TinyStopStartMovePolicy = (function () {
    function TinyStopStartMovePolicy() {
    }
    TinyStopStartMovePolicy.prototype.GetName = function () {
        return "TinyStopStartMovePolicy";
    };
    TinyStopStartMovePolicy.prototype.GetDistance = function (currentPositionInTheQueue) {
        return Math.round((Math.random() * 1));
    };
    return TinyStopStartMovePolicy;
})();
//# sourceMappingURL=TinyStopStartMovePolicy.js.map