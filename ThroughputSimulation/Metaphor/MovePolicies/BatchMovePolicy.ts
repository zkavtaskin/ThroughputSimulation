
class BatchMovePolicy implements IMovePolicy
{
    numToSkip: number = 0;
    totalZeroCount : number = 0;

    constructor(distance : number, numberOfGroups : number)
    {
        this.numToSkip = Math.round(distance / numberOfGroups);
    }

    public GetName() : string {
        return "BatchMovePolicy";
    }

    public GetDistance(currentPositionInTheQueue: number): number
    {
        if (currentPositionInTheQueue == 0) {
            let isOdd: boolean = Math.floor(this.totalZeroCount / this.numToSkip) % 2 == 1;

            this.totalZeroCount++;

            if (isOdd)
                return 0;
        }

        return 1;
    }
}

