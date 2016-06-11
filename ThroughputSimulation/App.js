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

window.onload = function () {
    /*
    $.plot("#plot", [{ label: "Foo", data: [[10, 1], [17, -14], [30, 5]] },
  { label: "Bar", data: [[11, 13], [19, 11], [30, -7]] }
    ]);
    */
   // $.plot("#plot", [{ data:[]}]);

    //let plot: jquery.flot.plot = $.plot($("#plot"), [this.dataSeries]);


    var flowView1 = new VisualFlowView("#simulationView1");
    var flowPresenter1 = new VisualFlowPresenter(flowView1, new ChaosStopStartMovePolicy(), 15);

    var flowView2 = new VisualFlowView("#simulationView2");
    var flowPresenter2 = new VisualFlowPresenter(flowView2, new SequentialMovePolicy(), 15);


    setInterval(function () {
        var dataSeries1 = flowView1.GetDataSeries();
        var dataSeries2 = flowView2.GetDataSeries();
        $.plot("#plot", [dataSeries1, dataSeries2]);
    }, 1000);
};