
class SequentialMovePolicy implements IMovePolicy
{
    public GetName(): string {
        return "SequentialMovePolicy";
    }

    public GetDistance(currentPositionInTheQueue: number): number
    {
        return 1;
    }
}