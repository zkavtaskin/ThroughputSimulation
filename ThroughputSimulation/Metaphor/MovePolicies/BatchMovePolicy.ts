
class BatchMovePolicy implements IMovePolicy
{
    spaceMaker: SymmetricSpaceMaker;

    constructor(emptySpaceSize : number)
    {
        this.spaceMaker = new SymmetricSpaceMaker(emptySpaceSize);
    }

    public GetName() : string {
        return "Batch";
    }

    public GetDistance(positionInTheQueue: number): number
    {
        if (this.spaceMaker.CalcIfShouldSkipMoveToMakeSpace(positionInTheQueue))
            return 0;

        return Math.round((Math.random() * 10)) != 0 ? 1 : 0; 
    }
}

