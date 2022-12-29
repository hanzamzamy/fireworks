export class Mouse {
    constructor(options, canvas) {
        this.options = options;
        this.canvas = canvas;
        this.active = false;
        this.pointerDown = this.pointerDown.bind(this);
        this.pointerUp = this.pointerUp.bind(this);
        this.pointerMove = this.pointerMove.bind(this);
    }
    get mouseOptions() {
        return this.options.mouse;
    }
    mount() {
        this.canvas.addEventListener('pointerdown', this.pointerDown);
        this.canvas.addEventListener('pointerup', this.pointerUp);
        this.canvas.addEventListener('pointermove', this.pointerMove);
    }
    unmount() {
        this.canvas.removeEventListener('pointerdown', this.pointerDown);
        this.canvas.removeEventListener('pointerup', this.pointerUp);
        this.canvas.removeEventListener('pointermove', this.pointerMove);
    }
    usePointer(event, active) {
        const { click, move } = this.mouseOptions;
        if (click || move) {
            this.x = event.pageX - this.canvas.offsetLeft;
            this.y = event.pageY - this.canvas.offsetTop;
            this.active = active;
        }
    }
    pointerDown(event) {
        this.usePointer(event, this.mouseOptions.click);
    }
    pointerUp(event) {
        this.usePointer(event, false);
    }
    pointerMove(event) {
        this.usePointer(event, this.active);
    }
}
