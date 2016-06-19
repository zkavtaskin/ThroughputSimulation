
class StuffJustHappensSlackMovePolicy implements IMovePolicy
{
    spaceMaker: AsymmetricSpaceMaker;

    constructor(spaceSize: number, groupSize: number) {
        this.spaceMaker = new AsymmetricSpaceMaker(spaceSize, groupSize);
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