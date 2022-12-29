export class RequestAnimationFrame {
    constructor(options, render) {
        this.options = options;
        this.render = render;
        this.tick = 0;
        this.rafId = 0;
        this.fps = 60;
        this.tolerance = 0.1;
    }
    mount() {
        this.now = performance.now();
        const interval = 1000 / this.fps;
        const raf = (timestamp) => {
            this.rafId = requestAnimationFrame(raf);
            const delta = timestamp - this.now;
            if (delta >= interval - this.tolerance) {
                this.render();
                this.now = timestamp - (delta % interval);
                this.tick += (delta * (this.options.intensity * Math.PI)) / 1000;
            }
        };
        this.rafId = requestAnimationFrame(raf);
    }
    unmount() {
        cancelAnimationFrame(this.rafId);
    }
}
