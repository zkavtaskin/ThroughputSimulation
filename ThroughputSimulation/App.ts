/// <reference path="Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="BallModel.ts" />
/// <reference path="CompletionChain.ts" />
/// <reference path="StatsModel.ts" />
/// <reference path="VisualFlowPresenter.ts" />
/// <reference path="VisualFlowView.ts" />
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

    let flowPresenterBatch: VisualFlowPresenter =
        new VisualFlowPresenter(
            new VisualFlowView("#simulationViewBatch"),
            new SequentialMovePolicy(),
            15
        );

};