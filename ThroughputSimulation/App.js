/// <reference path="Scripts/typings/jquery/jquery.d.ts" />

window.onload = function () {

    var throughputGlobalStatsView = new ThroughputGlobalStatsView();

    //new SimulationInMemoryPresenter(); 
    var simulatorPresenter1 = new SimulationVisualPresenter(new VisualFlowView("#simulationView1"));
    var multiPlexStatsView1 = new MultiPlexStatsView([new TextStatsView("#simulationView1"), throughputGlobalStatsView]);
    var controlsView1 = new AutoPlayControlsView(); //new PhysicalControlsView("#simulationView1");
    new ThroughputPresenter(simulatorPresenter1, multiPlexStatsView1, controlsView1, new StuffJustHappensMovePolicy(), 15);

    //new SimulationInMemoryPresenter(); 
    var simulatorPresenter2 = new SimulationVisualPresenter(new VisualFlowView("#simulationView2"));
    var multiPlexStatsView2 = new MultiPlexStatsView([new TextStatsView("#simulationView2"), throughputGlobalStatsView]);
    var controlsView2 = new AutoPlayControlsView();//new PhysicalControlsView("#simulationView2");
    new ThroughputPresenter(simulatorPresenter2, multiPlexStatsView2, controlsView2, new StuffJustHappensSlackMovePolicy(1), 15);

    //new SimulationInMemoryPresenter(); 
    var simulatorPresenter3 = new SimulationVisualPresenter(new VisualFlowView("#simulationView3"));
    var multiPlexStatsView3 = new MultiPlexStatsView([new TextStatsView("#simulationView3"), throughputGlobalStatsView]);
    var controlsView3 = new AutoPlayControlsView();//new PhysicalControlsView("#simulationView3");
    new ThroughputPresenter(simulatorPresenter3, multiPlexStatsView3, controlsView3, new SinglePieceFlowMovePolicy(), 15);

    //new SimulationInMemoryPresenter(); 
    var simulatorPresenter4 = new SimulationVisualPresenter(new VisualFlowView("#simulationView4"));
    var multiPlexStatsView4 = new MultiPlexStatsView([new TextStatsView("#simulationView4"), throughputGlobalStatsView]);
    var controlsView4 = new AutoPlayControlsView();//new PhysicalControlsView("#simulationView4");
    new ThroughputPresenter(simulatorPresenter4, multiPlexStatsView4, controlsView4, new BatchMovePolicy(15, 3), 15);

 
    setInterval(function () {
        $.plot("#plot", throughputGlobalStatsView.GetDataSeries());
    }, 1000);
};