# Throughput Simulator

## Objective
To provide basic open source throughput simulator to showcase different type of flows.
The following delivery flow examples are supported out of the box:
* Batch (Scrum, DSDM, etc)
* Single Piece Flow (Kanban)
* Waterfall
* Chaos 

When would you ever use this?

* Blog articles, it's a great way to make a point. 
* Training, visualsing different delivery flows.
* Monte Carlo method with Markov chain analysis for fun.

## Basic Demo

It's really easy to use and create simulations like this:

![alt text](https://github.com/zkavtaskin/ThroughputSimulation/blob/master/ReadMeImages/basic_demo.png?raw=true "Throughput Simulator Basic Demo")


## Advance Demo
If you are a bit more adventures you can create comparison simulations with charts:

![alt text](https://github.com/zkavtaskin/ThroughputSimulation/blob/master/ReadMeImages/advance_demo.png?raw=true "Throughput Simulator Advance Demo")

## Basic Setup

**JavaScript**
```
new ThroughputPresenter(
        new SimulationVisualPresenter(new VisualFlowView("#simulationView")),
        new TextStatsView("#simulationView"),
        new PhysicalControlsView("#simulationView"),
        new WaterfallMovePolicy(),
        10);
```

**HTML**
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Throughput Simulation</title>
    <link rel="stylesheet" href="app.css" type="text/css" />
    <script src="http://code.jquery.com/jquery-2.2.3.js"></script>
    <script src="throughputsimulation.js"></script>
    <script src="App.js"></script>
</head>
<body>
	<div class="simulationView" id="simulationView">
		<div class="buttons">
			<input type="button" value="Play" id="play" />
			<input type="button" value="Stop" id="stop"/>
		</div>
		<div class="simulationVisualiser" id="simulationVisualiser"></div>
		<div class="simulationStatistics" id="simulationStatistics">
			<div>
				<span class="title">Average lead time (sec):</span>
				<span class="metric" id="statsLeadTime">...</span>
			</div>
			<div>
				<span class="title">Running time (sec):</span>
				<span class="metric" id="statsRunningTime">...</span>
			</div>
			<div>
				<span class="title">Interlocks:</span>
				<span class="metric" id="statsInterlocks">...</span>
			</div>
			<div>
				<span class="title">Total Arrived:</span>
				<span class="metric" id="statsArrived">...</span>
			</div>
			<div>
				<span class="title">Delivered per second:</span>
				<span class="metric" id="statsThroughputRate">...</span>
			</div>
		</div>
	</div>
</body>
</html>
```

## Advance Setup

**JavaScript**
```
    var throughputStatsView = new ThroughputStatsView();

    new ThroughputPresenter(
        new SimulationVisualPresenter(new VisualFlowView("#simulationViewA")),
        new MultiPlexStatsView([new TextStatsView("#simulationViewA"), throughputStatsView]),
        new AutoPlayControlsView(),
        new SinglePieceFlowMovePolicy(),
        10
    );

    new ThroughputPresenter(
        new SimulationVisualPresenter(new VisualFlowView("#simulationViewB")),
        new MultiPlexStatsView([new TextStatsView("#simulationViewB"), throughputStatsView]),
        new AutoPlayControlsView(),
        new BatchMovePolicy(5),
        10
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
</script>
```

**HTML**
```
<div class="plot-container" style="text-align:center;width:500px;">
<div id="plot" style="width:500px;height:300px;"></div>
<span>Number of items delivered vs Delivery methods</span>
</div>


<div class="simulationView" id="simulationViewA">
    <div class="simulationVisualiser" id="simulationVisualiser"></div>
    <div class="simulationStatistics" id="simulationStatistics">
        <div>
            <span class="title">Average lead time (sec):</span>
            <span class="metric" id="statsLeadTime">...</span>
        </div>
        <div>
            <span class="title">Running time (sec):</span>
            <span class="metric" id="statsRunningTime">...</span>
        </div>
        <div>
            <span class="title">Interlocks:</span>
            <span class="metric" id="statsInterlocks">...</span>
        </div>
        <div>
            <span class="title">Total Arrived:</span>
            <span class="metric" id="statsArrived">...</span>
        </div>
        <div>
            <span class="title">Delivered per second:</span>
            <span class="metric" id="statsThroughputRate">...</span>
        </div>
    </div>
</div>


<div class="simulationView" id="simulationViewB">
    <div class="simulationVisualiser" id="simulationVisualiser"></div>
    <div class="simulationStatistics" id="simulationStatistics">
        <div>
            <span class="title">Average lead time (sec):</span>
            <span class="metric" id="statsLeadTime">...</span>
        </div>
        <div>
            <span class="title">Running time (sec):</span>
            <span class="metric" id="statsRunningTime">...</span>
        </div>
        <div>
            <span class="title">Interlocks:</span>
            <span class="metric" id="statsInterlocks">...</span>
        </div>
        <div>
            <span class="title">Total Arrived:</span>
            <span class="metric" id="statsArrived">...</span>
        </div>
        <div>
            <span class="title">Delivered per second:</span>
            <span class="metric" id="statsThroughputRate">...</span>
        </div>
    </div>
</div>
```


## Create your own flows
You can create your own flows (Move Policies), all move policies can be found here:
ThroughputSimulation\Metaphor\MovePolicies\

To create your own move policy create a class that implements IMovePolicy, then just provide the distance 
that you would like the ball to move by filling in GetDistance(currentPositionInTheQueue: number).

**For example:**

Ball always moves forward by one
```
    public GetDistance(currentPositionInTheQueue: number): number
    {
        return 1;
    }
```

Ball moves forward randomly only half the time
```
    public GetDistance(currentPositionInTheQueue: number): number
    {
        return Math.round((Math.random() * 1));
    }
```

Ball moves forward randomly only half the time and 
when the ball does move forward it moves at the random distance between 1 and 4
```
    public GetDistance(currentPositionInTheQueue: number): number
    {
        return Math.round((Math.random() * 1)) * Math.round((Math.random() * 3) + 1);
    }
```

## Questions?
Contact me on Twitter @zankavtaskin and don't forget to visit my blog [http://www.zankavtaskin.com]()
