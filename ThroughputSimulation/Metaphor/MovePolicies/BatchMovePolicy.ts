﻿
class BatchMovePolicy implements IMovePolicy
{
    spaceMaker: SpaceMaker;

    constructor(distance : number, numberOfGroups : number)
    {
        this.spaceMaker = new SpaceMaker(Math.round(distance / numberOfGroups));
    }

    public GetName() : string {
        return "Batch";
    }

    public GetDistance(positionInTheQueue: number): number
    {
        if (this.spaceMaker.CalcIfShouldSkipMoveToMakeSpace(positionInTheQueue))
            return 0;

        return Math.round((Math.random() * 10)) != 0 ? 1 : 0; 
    }
}

