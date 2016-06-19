
class ChaosMovePolicy implements IMovePolicy
{
    public GetName(): string {
        return "Chaos";
    }

    public GetDistance(currentPositionInTheQueue: number): number
    {
        return Math.round((Math.random() * 1)) * Math.round((Math.random() * 3) + 1);
    }
}