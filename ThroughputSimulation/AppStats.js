
window.onload = function () {
    var trackDistance = 100;
    var numberOfIterations = 10000;
    var movePolicies = new Array();
    movePolicies.push(new WaterfallMovePolicy());
    movePolicies.push(new WaterfallSlackMovePolicy(2, 1));
    movePolicies.push(new SinglePieceFlowMovePolicy());
    movePolicies.push(new SinglePieceFlowSlackMovePolicy(1, 1));
    movePolicies.push(new BatchMovePolicy(33));
    movePolicies.push(new ChaosMovePolicy());
    movePolicies.push(new ChaosSlackMovePolicy(2, 1));
    document.writeln("-- Throughput Analysis, track distance: " + trackDistance + ", iterations: " + numberOfIterations + " --  <br/>");
    for (var _i = 0, movePolicies_1 = movePolicies; _i < movePolicies_1.length; _i++) {
        var movePolicy = movePolicies_1[_i];
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
        document.writeln("Arrived in %: " + (controlCenter.GetTrainsReachedDestination() / numberOfIterations) * 100 + " <br/>");
        document.writeln("Overall experiment run time: " + (end - start) + " <br/>");
        document.writeln("Delivery per tick: " + controlCenter.GetTrainsReachedDestination() / (end - start) + " <br/></p>");
    }
};