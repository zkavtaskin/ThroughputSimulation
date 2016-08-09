
window.onload = function () {

    //Basic Demo
    new ThroughputPresenter(
            new SimulationVisualPresenter(new VisualFlowView("#simulationView")),
            new TextStatsView("#simulationView"),
            new PhysicalControlsView("#simulationView"),
            new WaterfallMovePolicy(),
            15);


    //Advance Demo
    var throughputStatsView = new ThroughputStatsView();

    new ThroughputPresenter(
        new SimulationVisualPresenter(new VisualFlowView("#simulationViewA")),
        new MultiPlexStatsView([new TextStatsView("#simulationViewA"), throughputStatsView]),
        new AutoPlayControlsView(),
        new SinglePieceFlowMovePolicy(),
        15
    );

    new ThroughputPresenter(
        new SimulationVisualPresenter(new VisualFlowView("#simulationViewB")),
        new MultiPlexStatsView([new TextStatsView("#simulationViewB"), throughputStatsView]),
        new AutoPlayControlsView(),
        new BatchMovePolicy(5),
        15
    );

    setInterval(function () {
            $.plot(
                "#plot",
                [throughputStatsView.GetData()],
                {
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
                }
            );
        }
        ,
        1000
    );
};