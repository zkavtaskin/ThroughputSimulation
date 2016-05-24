
class Train {
    journeyStart: number;
    journeyEnd: number;
    finalDestinationPosition: number = 0;

    Position: number = 0;
    Id: number;

    onTrainMovedHandlers: { (train: Train): void }[] = [];
    onTrainMovedAndThenArrivedHandlers: { (train: Train): void }[] = [];

    constructor(trackDistance: number)
    {
        this.Id = Math.round(Math.random() * 1000000);
        this.finalDestinationPosition = trackDistance;
        this.journeyStart = performance.now();
    }

    public Move(distanceToMove: number): void
    {
        let newPosition : number = this.Position + distanceToMove;

        if (newPosition >= this.finalDestinationPosition) {
            this.Position = this.finalDestinationPosition;
            this.journeyEnd = performance.now();
            this.onTrainMovedAndThenArrivedHandlers.forEach(h => h(this));
        }
        else {
            this.Position += distanceToMove;
            this.onTrainMovedHandlers.forEach(h => h(this));
        }
    }

    public CheckIfDistanceIsClear(distanceToMove : number, positionMap: { [positionId: number]: Train }): boolean
    {
        let  trainInFrontFound : boolean = false;
        for (let k : number = 1; k <= distanceToMove && !trainInFrontFound; k++)
        {
            trainInFrontFound = positionMap[this.Position + k] != null;
            if (trainInFrontFound)
                return false;
        }

        return true;
    }

    public GetElapsedTicks() : number
    {
        return this.journeyEnd - this.journeyStart;
    }

    public AddEventOnTrainMoved(handler: { (train: Train): void }): void {
        this.onTrainMovedHandlers.push(handler);
    }

    public RemoveEventOnTrainMoved(handler: { (train: Train): void }): void {
        this.onTrainMovedHandlers = this.onTrainMovedHandlers.filter(h => h != handler);
    }

    public AddEventOnTrainMovedThenArrived(handler: { (train: Train): void }): void {
        this.onTrainMovedAndThenArrivedHandlers.push(handler);
    }

    public RemoveEventOnTrainMovedThenArrived(handler: { (train: Train): void }): void {
        this.onTrainMovedAndThenArrivedHandlers =
            this.onTrainMovedAndThenArrivedHandlers.filter(h => h != handler);
    }
   
}

