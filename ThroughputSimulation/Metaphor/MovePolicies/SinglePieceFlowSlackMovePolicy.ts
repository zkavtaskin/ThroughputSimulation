
class SinglePieceFlowSlackMovePolicy implements IMovePolicy
{
    spaceMaker: SpaceMaker;

    constructor(spaceSize: number) {
        this.spaceMaker = new SpaceMaker(spaceSize);
    }


    public GetName(): string {
        return "SinglePieceFlowSlack";
    }

    public GetDistance(positionInTheQueue: number): number
    {
        if (this.spaceMaker.CalcIfShouldSkipMoveToMakeSpace(positionInTheQueue))
            return 0;

        return Math.round((Math.random() * 10)) != 0 ? 1 : 0; 
    }
}