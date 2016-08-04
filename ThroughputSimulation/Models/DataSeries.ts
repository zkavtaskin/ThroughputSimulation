/// <reference path="../Scripts/typings/flot/jquery.flot.d.ts" />

class DataSeries implements jquery.flot.dataSeries {
    data: Array<Array<number>> = new Array<Array<number>>();
    label: string;
    constructor(label: string) {
        this.label = label;
    }
}
