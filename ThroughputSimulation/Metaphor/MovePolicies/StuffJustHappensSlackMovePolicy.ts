
class StuffJustHappensSlackMovePolicy implements IMovePolicy
{
    spaceMaker: SpaceMaker;

    constructor(spaceSize: number) {
        this.spaceMaker = new SpaceMaker(spaceSize);
    }

    public GetName(): string {
        return "StuffJustHappensSlack";
    }

    public GetDistance(positionInTheQueue: number): number
    {
        if (this.spaceMaker.CalcIfShouldSkipMoveToMakeSpace(positionInTheQueue))
            return 0;

        return Math.round((Math.random() * 1));
    }
}