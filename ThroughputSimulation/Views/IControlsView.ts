
interface IControlsView {
    AddEventPlay(handler: { (): void }) : void;
    AddEventStop(handler: { (): void }) : void;
}