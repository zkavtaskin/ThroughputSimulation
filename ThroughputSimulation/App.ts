/// <reference path="Scripts/typings/jquery/jquery.d.ts" />

window.onload = () => {

    let flowPresenterBatch: VisualFlowPresenter =
        new VisualFlowPresenter(
            new VisualFlowView("#simulationViewBatch"),
            new BatchMovePolicy(15, 3),
            15
        );

};