
class AutoPlayControlsView implements IControlsView {
    AddEventPlay(handler: { (): void }) {
        handler();
    }

    AddEventStop(handler: { (): void }) {

    }
}