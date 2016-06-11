/// <reference path="Metaphor/ControlCenter.ts" />
/// <reference path="Metaphor/Train.ts" />
/// <reference path="Metaphor/MovePolicies/BatchMovePolicy.ts" />
/// <reference path="Metaphor/MovePolicies/ChaosStopStartMovePolicy.ts" />
/// <reference path="Metaphor/MovePolicies/DoubleSequentialMovePolicy.ts" />
/// <reference path="Metaphor/MovePolicies/IMovePolicy.ts" />
/// <reference path="Metaphor/MovePolicies/LargeStopStartMovePolicy.ts" />
/// <reference path="Metaphor/MovePolicies/MediumStopStartMovePolicy.ts" />
/// <reference path="Metaphor/MovePolicies/SequentialMovePolicy.ts" />
/// <reference path="Metaphor/MovePolicies/TinyStopStartMovePolicy.ts" />

window.onload = () => {

    let trackDistance : number = 100;
    let numberOfIterations: number = 10000;

    let movePolicies = new Array<IMovePolicy>();
    movePolicies.push(new TinyStopStartMovePolicy());
    movePolicies.push(new MediumStopStartMovePolicy());
    movePolicies.push(new LargeStopStartMovePolicy());
    movePolicies.push(new ChaosStopStartMovePolicy());
    movePolicies.push(new SequentialMovePolicy());
    movePolicies.push(new DoubleSequentialMovePolicy());
    movePolicies.push(new BatchMovePolicy(trackDistance, 20));


    document.writeln(`-- Throughput Analysis, track distance: ${trackDistance}, iterations: ${numberOfIterations} --  <br/>`);

    for (var movePolicy of movePolicies) {
        let start: number = performance.now();
        let controlCenter: ControlCenter = new ControlCenter(trackDistance);

        document.writeln(`<p>--- Move Policy: ${movePolicy.GetName()} --- <br/>`);

        for (let i: number = 1; i <= numberOfIterations; i++) {
            controlCenter.PutOnTrackNewTrain();
            controlCenter.MoveAllTrainsOnTrack(movePolicy, (train : Train) => { });
        }
        let end: number = performance.now();

        document.writeln(`Trains still on track: #${controlCenter.GetTrainsOnTrackCount()} <br/>`);
        document.writeln(`Average lead time: ${controlCenter.GetAverageTrainJourneyTicks()} ticks per train <br/>`);
        document.writeln(`Interlocks: ${controlCenter.GetInterlocks()} <br/>`);
        document.writeln(`Arrived: ${controlCenter.GetTrainsReachedDestination()} <br/>`);
        document.writeln(`Completed in %: ${(controlCenter.GetTrainsReachedDestination() / numberOfIterations) * 100} <br/>`);
        document.writeln(`Overall experiment run time: ${end - start} <br/>`);
        document.writeln(`Delivery per tick: ${controlCenter.GetTrainsReachedDestination() / (end - start)} <br/></p>`);
     
    }

};