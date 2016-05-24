
class MediumStopStartMovePolicy implements IMovePolicy
{
    public GetName(): string {
        return "MediumStopStartMovePolicy";
    }

    public GetDistance(currentPositionInTheQueue: number): number
    {
        return Math.round((Math.random() * 1)) * 2;
    }
}