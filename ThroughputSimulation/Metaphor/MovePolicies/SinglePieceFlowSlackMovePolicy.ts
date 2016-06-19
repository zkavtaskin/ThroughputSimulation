
class SinglePieceFlowSlackMovePolicy implements IMovePolicy
{
    spaceMaker: AsymmetricSpaceMaker;

    constructor(spaceSize: number, groupSize: number) {
        this.spaceMaker = new AsymmetricSpaceMaker(spaceSize, groupSize);
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