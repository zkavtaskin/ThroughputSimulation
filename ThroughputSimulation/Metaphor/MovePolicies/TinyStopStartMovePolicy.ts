
class TinyStopStartMovePolicy implements IMovePolicy
{
    public GetName(): string {
        return "TinyStopStartMovePolicy";
    }

    public GetDistance(currentPositionInTheQueue: number): number
    {
        return Math.round((Math.random() * 1));
    }
}