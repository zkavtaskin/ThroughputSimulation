/// <reference path="Scripts/typings/jquery/jquery.d.ts" />

window.onload = function () {

    //var throughputGlobalStatsView = new ThroughputGlobalStatsView();
    var throughputStatsView = new ThroughputStatsView();
    /*
    //new SimulationInMemoryPresenter(); 
    var simulatorPresenter1 = new SimulationVisualPresenter(new VisualFlowView("#simulationView1"));
    var multiPlexStatsView1 = new MultiPlexStatsView([new TextStatsView("#simulationView1"), throughputGlobalStatsView]);
    var controlsView1 = new AutoPlayControlsView(); //new PhysicalControlsView("#simulationView1");
    new ThroughputPresenter(simulatorPresenter1, multiPlexStatsView1, controlsView1, new StuffJustHappensMovePolicy(), 15);
    */
    //new SimulationInMemoryPresenter(); 
    var simulatorPresenter2 = new SimulationVisualPresenter(new VisualFlowView("#simulationView2"));
    var multiPlexStatsView2 = new MultiPlexStatsView([new TextStatsView("#simulationView2"), throughputStatsView]);
    var controlsView2 = new AutoPlayControlsView();//new PhysicalControlsView("#simulationView2");
    new ThroughputPresenter(simulatorPresenter2, multiPlexStatsView2, controlsView2, new BatchMovePolicy(5), 15);


    //new SimulationInMemoryPresenter(); 
    var simulatorPresenter3 = new SimulationVisualPresenter(new VisualFlowView("#simulationView3"));
    var multiPlexStatsView3 = new MultiPlexStatsView([new TextStatsView("#simulationView3"), throughputStatsView]);
    var controlsView3 = new AutoPlayControlsView();//new PhysicalControlsView("#simulationView3");
    new ThroughputPresenter(simulatorPresenter3, multiPlexStatsView3, controlsView3, new StuffJustHappensMovePolicy(), 15);

    //new SimulationInMemoryPresenter(); 
    var simulatorPresenter4 = new SimulationVisualPresenter(new VisualFlowView("#simulationView4"));
    var multiPlexStatsView4 = new MultiPlexStatsView([new TextStatsView("#simulationView4"), throughputStatsView]);
    var controlsView4 = new AutoPlayControlsView();//new PhysicalControlsView("#simulationView4");
    new ThroughputPresenter(simulatorPresenter4, multiPlexStatsView4, controlsView4, new SinglePieceFlowMovePolicy(), 15);

 
    setInterval(function () {
        
        var data = throughputStatsView.GetData();

        var options = {
            series: {
                bars: {
                    show: true,
                    barWidth: 0.6,
                    align: "center"
                }
            },
            xaxis: {
                mode: "categories",
                tickLength: 0
            }
        };

        $.plot("#plot", [data] , options);

    }, 1000);
};