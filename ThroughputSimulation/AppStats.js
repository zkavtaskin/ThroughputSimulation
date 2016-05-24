window.onload = function () {
    var trackDistance = 100;
    var numberOfIterations = 10000;
    var movePolicies = new Array();
    movePolicies.push(new TinyStopStartMovePolicy());
    movePolicies.push(new MediumStopStartMovePolicy());
    movePolicies.push(new LargeStopStartMovePolicy());
    movePolicies.push(new ChaosStopStartMovePolicy());
    movePolicies.push(new SequentialMovePolicy());
    movePolicies.push(new DoubleSequentialMovePolicy());
    movePolicies.push(new BatchMovePolicy(trackDistance, 20));
    document.writeln("-- Throughput Analysis, track distance: " + trackDistance + ", iterations: " + numberOfIterations + " --  <br/>");
    for (var _i = 0; _i < movePolicies.length; _i++) {
        var movePolicy = movePolicies[_i];
        var start = performance.now();
        var controlCenter = new ControlCenter(trackDistance);
        document.writeln("<p>--- Move Policy: " + movePolicy.GetName() + " --- <br/>");
        for (var i = 1; i <= numberOfIterations; i++) {
            controlCenter.PutOnTrackNewTrain();
            controlCenter.MoveAllTrainsOnTrack(movePolicy, function (train) { });
        }
        var end = performance.now();
        document.writeln("Trains still on track: #" + controlCenter.GetTrainsOnTrackCount() + " <br/>");
        document.writeln("Average lead time: " + controlCenter.GetAverageTrainJourneyTicks() + " ticks per train <br/>");
        document.writeln("Interlocks: " + controlCenter.GetInterlocks() + " <br/>");
        document.writeln("Arrived: " + controlCenter.GetTrainsReachedDestination() + " <br/>");
        document.writeln("Completed in %: " + (controlCenter.GetTrainsReachedDestination() / numberOfIterations) * 100 + " <br/>");
        document.writeln("Overall experiment run time: " + (end - start) + " <br/>");
        document.writeln("Delivery per tick: " + controlCenter.GetTrainsReachedDestination() / (end - start) + " <br/></p>");
    }
};
//# sourceMappingURL=AppStats.js.map