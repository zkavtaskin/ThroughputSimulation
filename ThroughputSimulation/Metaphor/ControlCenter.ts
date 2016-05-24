
class ControlCenter {
    interlockCount: number = 0;
    trainsReachedDestination: number = 0;
    positionMap: { [positionId: number]: Train } = {};

    trains: Array<Train> = [];
    totalTicks: number = 0;
    trackDistance: number = 0;

    onTrainMovedProxy: (train: Train) => void;
    onTrainMovedAndArrivedProxy: (train: Train) => void;

    constructor(trackDistance: number)
    {
        this.trackDistance = trackDistance;
        this.onTrainMovedProxy = (train : Train) => {
            this.onTrainMoved.apply(this, [train]);
        };
        this.onTrainMovedAndArrivedProxy = (train: Train) => {
            this.onTrainMovedAndArrived.apply(this, [train]);
        };
    }

    PutOnTrackNewTrain() : Train
    {
        let train : Train = new Train(this.trackDistance);
        if (this.positionMap[train.Position] == null) {
            train.AddEventOnTrainMoved(this.onTrainMovedProxy);
            train.AddEventOnTrainMovedThenArrived(this.onTrainMovedAndArrivedProxy);
            this.positionMap[train.Position] = train;
            this.trains.push(train);
            return train;
        }
        return null;
    }

    public MoveAllTrainsOnTrack(movePolicy: IMovePolicy,
        onTrainBlocked: (train: Train) => void): void
    {
        let trainCount: number = this.trains.length;
        for (let i : number = 0; i < trainCount; i++)
        {
            let train: Train = this.trains.shift();
            let distanceToMove : number = movePolicy.GetDistance(train.Position);

            if (train.CheckIfDistanceIsClear(distanceToMove, this.positionMap)) {
                this.positionMap[train.Position] = null;
                train.Move(distanceToMove);
            }
            else {
                onTrainBlocked(train);
                this.trains.push(train);
                this.interlockCount++;
            }
        }
    }

    private onTrainMoved(train : Train) : void
    {
        this.positionMap[train.Position] = train;
        this.trains.push(train);
    }

    private onTrainMovedAndArrived(train : Train) : void
    {
        this.totalTicks += train.GetElapsedTicks();
        this.trainsReachedDestination++;
        train.RemoveEventOnTrainMoved(this.onTrainMovedProxy);
        train.RemoveEventOnTrainMovedThenArrived(this.onTrainMovedAndArrivedProxy);
    }

    public GetTrainsOnTrackCount(): number
    {
        return this.trains.length;
    }

    public GetInterlocks(): number {
        return this.interlockCount;
    }

    public GetTrainsReachedDestination(): number {
        return this.trainsReachedDestination;
    }

    public GetAverageTrainJourneyTicks(): number
    {
        return this.totalTicks / this.trainsReachedDestination;
    }
}
