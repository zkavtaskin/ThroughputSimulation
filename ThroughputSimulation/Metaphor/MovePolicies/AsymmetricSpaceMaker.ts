
class AsymmetricSpaceMaker
{
    emptySpaceSize: number = 0;
    groupSize: number = 0;
    groupAndEmptySpaceSize = 0;
    totalZeroCount: number = 0;

    constructor(emptySpaceSize: number, groupSize: number) {
        this.emptySpaceSize = emptySpaceSize;
        this.groupSize = groupSize;
        this.groupAndEmptySpaceSize = this.emptySpaceSize + this.groupSize;
    }

    public CalcIfShouldSkipMoveToMakeSpace(positionInTheQueue: number): boolean
    {
        if (positionInTheQueue == 0) {
            if ((this.totalZeroCount++ % this.groupAndEmptySpaceSize) + 1 > this.groupSize)
                return true;   
        }

        return false;
    }
}