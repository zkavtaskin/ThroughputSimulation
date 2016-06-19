
class SymmetricSpaceMaker
{
    emptySpaceSize: number = 0;
    totalZeroCount: number = 0;

    constructor(emptySpaceSize: number) {
        this.emptySpaceSize = emptySpaceSize;
    }

    public CalcIfShouldSkipMoveToMakeSpace(positionInTheQueue: number): boolean
    {
        if (positionInTheQueue == 0) {
            if (Math.floor(this.totalZeroCount++ / this.emptySpaceSize) % 2 == 1)
                return true;
        }

        return false;
    }
}