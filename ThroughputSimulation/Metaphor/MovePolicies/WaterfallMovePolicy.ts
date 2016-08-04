
class WaterfallMovePolicy implements IMovePolicy
{
    public GetName(): string {
        return "Waterfall";
    }

    public GetDistance(currentPositionInTheQueue: number): number
    {
        return Math.round((Math.random() * 1));
    }
}