
class LargeStopStartMovePolicy implements IMovePolicy
{
    public GetName(): string {
        return "LargeStopStartMovePolicy";
    }

    public GetDistance(currentPositionInTheQueue: number): number
    {
        return Math.round((Math.random() * 1)) * 3;
    }
}