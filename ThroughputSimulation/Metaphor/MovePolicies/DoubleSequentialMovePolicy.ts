
class DoubleSequentialMovePolicy implements IMovePolicy
{
    public GetName(): string {
        return "DoubleSequentialMovePolicy";
    }

    public GetDistance(currentPositionInTheQueue: number): number
    {
        return 2;
    }
}