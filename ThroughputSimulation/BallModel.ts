/// <reference path="Scripts/typings/jquery/jquery.d.ts" />


class BallModel {
    id: number;
    position: number;
    color: string;

    constructor(id: number, position: number, color : string) {
        this.id = id;
        this.position = position;
        this.color = color;
    }
}
