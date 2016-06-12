﻿/// <reference path="Scripts/typings/jquery/jquery.d.ts" />

window.onload = function () {

    var throughputGlobalStatsView = new ThroughputGlobalStatsView();

    //new SimulationInMemoryPresenter(); 
    var simulatorPresenter1 = new SimulationVisualPresenter(new VisualFlowView("#simulationView1"));
    var multiPlexStatsView1 = new MultiPlexStatsView([new TextStatsView("#simulationView1"), throughputGlobalStatsView]);
    var controlsView1 = new AutoPlayControlsView(); //new PhysicalControlsView("#simulationView1");
    new ThroughputPresenter(simulatorPresenter1, multiPlexStatsView1, controlsView1, new ChaosStopStartMovePolicy(), 15);

    //new SimulationInMemoryPresenter(); 
    var simulatorPresenter2 = new SimulationVisualPresenter(new VisualFlowView("#simulationView2"));
    var multiPlexStatsView2 = new MultiPlexStatsView([new TextStatsView("#simulationView2"), throughputGlobalStatsView]);
    var controlsView2 = new AutoPlayControlsView();//new PhysicalControlsView("#simulationView2");
    new ThroughputPresenter(simulatorPresenter2, multiPlexStatsView2, controlsView2, new SequentialMovePolicy(), 15);

 
    setInterval(function () {
        $.plot("#plot", throughputGlobalStatsView.GetDataSeries());
    }, 1000);
};