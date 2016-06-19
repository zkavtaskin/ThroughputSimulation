
class StuffJustHappensMovePolicy implements IMovePolicy
{
    public GetName(): string {
        return "StuffJustHappens";
    }

    public GetDistance(currentPositionInTheQueue: number): number
    {
        return Math.round((Math.random() * 1));
    }
}