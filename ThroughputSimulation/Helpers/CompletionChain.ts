class CompletionChain {
    chainIndex: number = 0;
    chainList: Array<{ (): void }> = new Array<{ (): void }>();
    onChainComplete: { (): void } = () => { };

    public Add(funcToComplete: { (callBack: { (): void }): void }): CompletionChain {
        let myself: CompletionChain = this;
        this.chainList.push(function () {
            funcToComplete(function () {
                myself.chainIndex++;
                myself.execNextFuncInTheChain(myself.chainIndex);
            });
        });
        return this;
    }

    public Run(callBack: { (): void }): void {
        if (callBack != null)
            this.onChainComplete = callBack;

        this.execNextFuncInTheChain(0);
    }

    public Reset(): void {
        this.chainIndex = 0;
        this.chainList = new Array<{ (): void }>();
        this.onChainComplete = () => { };
    }

    private execNextFuncInTheChain(index: number): void {
        if (this.chainList[index] != null) {
            this.chainList[index]();
        } else {
            this.onChainComplete();
        }
    }
}