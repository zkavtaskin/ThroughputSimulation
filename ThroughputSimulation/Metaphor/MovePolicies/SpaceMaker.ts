
class SpaceMaker
{
    emptySpaceSize: number = 0;
    totalZeroCount: number = 0;

    constructor(emptySpaceSize: number) {
        this.emptySpaceSize = emptySpaceSize;
    }

    public CalcIfShouldSkipMoveToMakeSpace(positionInTheQueue: number): boolean
    {
        if (positionInTheQueue == 0) {
            let isOdd: boolean = Math.floor(this.totalZeroCount / this.emptySpaceSize) % 2 == 1;

            this.totalZeroCount++;

            if (isOdd)
                return true;
        }

        return false;
    }
}