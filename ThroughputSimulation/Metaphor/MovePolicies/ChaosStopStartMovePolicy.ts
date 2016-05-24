
class ChaosStopStartMovePolicy implements IMovePolicy
{
    public GetName(): string {
        return "ChaosStopStartMovePolicy";
    }

    public GetDistance(currentPositionInTheQueue: number): number
    {
        return Math.round((Math.random() * 1)) * Math.round((Math.random() * 3) + 1);
    }
}