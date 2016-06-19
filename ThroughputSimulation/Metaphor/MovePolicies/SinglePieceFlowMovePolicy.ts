
class SinglePieceFlowMovePolicy implements IMovePolicy
{
    public GetName(): string {
        return "SinglePieceFlow";
    }

    public GetDistance(currentPositionInTheQueue: number): number
    {
        return Math.round((Math.random() * 10)) != 0 ? 1 : 0; 
    }
}