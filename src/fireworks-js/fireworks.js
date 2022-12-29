import { Explosion } from './explosion.js';
import { floor, randomFloat, randomInt } from './helpers.js';
import { Mouse } from './mouse.js';
import { Options } from './options.js';
import { RequestAnimationFrame } from './raf.js';
import { Resize } from './resize.js';
import { Sound } from './sound.js';
import { Trace } from './trace.js';
export class Fireworks {
    constructor(container, options = {}) {
        this.traces = [];
        this.explosions = [];
        this.running = false;
        this.target = container;
        this.container = container;
        this.opts = new Options();
        this.updateOptions(options);
        this.createCanvas(this.target);
        this.sound = new Sound(this.opts);
        this.resize = new Resize(this.opts, this.updateSize.bind(this));
        this.mouse = new Mouse(this.opts, this.canvas);
        this.raf = new RequestAnimationFrame(this.opts, this.render.bind(this));
    }
    get isRunning() {
        return this.running;
    }
    get currentOptions() {
        return this.opts;
    }
    start() {
        if (this.running)
            return;
        if (!this.canvas.isConnected) {
            this.createCanvas(this.target);
        }
        this.running = true;
        this.resize.mount();
        this.mouse.mount();
        this.raf.mount();
    }
    stop(dispose = false) {
        if (!this.running)
            return;
        this.running = false;
        this.resize.unmount();
        this.mouse.unmount();
        this.raf.unmount();
        this.clear();
        if (dispose) {
            this.canvas.remove();
        }
    }
    async waitStop(dispose) {
        if (!this.running)
            return;
        return new Promise((resolve) => {
            this.waitStopRaf = () => {
                if (!this.waitStopRaf)
                    return;
                requestAnimationFrame(this.waitStopRaf);
                if (!this.traces.length && !this.explosions.length) {
                    this.waitStopRaf = null;
                    this.stop(dispose);
                    resolve();
                }
            };
            this.waitStopRaf();
        });
    }
    pause() {
        this.running = !this.running;
        if (this.running) {
            this.raf.mount();
        }
        else {
            this.raf.unmount();
        }
    }
    clear() {
        if (!this.ctx)
            return;
        this.traces = [];
        this.explosions = [];
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    launch(count = 1) {
        for (let i = 0; i < count; i++) {
            this.createTrace();
        }
        if (!this.waitStopRaf) {
            this.start();
            this.waitStop();
        }
    }
    updateOptions(options) {
        this.opts.update(options);
    }
    updateSize({ width = this.container.clientWidth, height = this.container.clientHeight } = {}) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        this.updateBoundaries({
            ...this.opts.boundaries,
            width,
            height
        });
    }
    updateBoundaries(boundaries) {
        this.updateOptions({ boundaries });
    }
    createCanvas(el) {
        if (el instanceof HTMLCanvasElement) {
            if (!el.isConnected) {
                document.body.append(el);
            }
            this.canvas = el;
        }
        else {
            this.canvas = document.createElement('canvas');
            this.container.append(this.canvas);
        }
        this.ctx = this.canvas.getContext('2d');
        this.updateSize();
    }
    render() {
        if (!this.ctx || !this.running)
            return;
        const { opacity, lineStyle, lineWidth } = this.opts;
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.globalCompositeOperation = 'lighter';
        this.ctx.lineCap = lineStyle;
        this.ctx.lineJoin = 'round';
        this.ctx.lineWidth = randomFloat(lineWidth.trace.min, lineWidth.trace.max);
        this.initTrace();
        this.drawTrace();
        this.drawExplosion();
    }
    createTrace() {
        const { hue, rocketsPoint, boundaries, traceLength, traceSpeed, acceleration, mouse } = this.opts;
        this.traces.push(new Trace({
            x: (this.width * randomInt(rocketsPoint.min, rocketsPoint.max)) / 100,
            y: this.height,
            dx: (this.mouse.x && mouse.move) || this.mouse.active
                ? this.mouse.x
                : randomInt(boundaries.x, boundaries.width - boundaries.x * 2),
            dy: (this.mouse.y && mouse.move) || this.mouse.active
                ? this.mouse.y
                : randomInt(boundaries.y, boundaries.height * 0.5),
            ctx: this.ctx,
            hue: randomInt(hue.min, hue.max),
            speed: traceSpeed,
            acceleration,
            traceLength: floor(traceLength)
        }));
    }
    initTrace() {
        if (this.waitStopRaf)
            return;
        const { delay, mouse } = this.opts;
        if (this.raf.tick > randomInt(delay.min, delay.max) ||
            (this.mouse.active && mouse.max > this.traces.length)) {
            this.createTrace();
            this.raf.tick = 0;
        }
    }
    drawTrace() {
        let traceLength = this.traces.length;
        while (traceLength--) {
            this.traces[traceLength].draw();
            this.traces[traceLength].update((x, y, hue) => {
                this.initExplosion(x, y, hue);
                this.sound.play();
                this.traces.splice(traceLength, 1);
            });
        }
    }
    initExplosion(x, y, hue) {
        const { particles, flickering, lineWidth, explosion, brightness, friction, gravity, decay } = this.opts;
        let particlesLength = floor(particles);
        while (particlesLength--) {
            this.explosions.push(new Explosion({
                x,
                y,
                ctx: this.ctx,
                hue,
                friction,
                gravity,
                flickering: randomInt(0, 100) <= flickering,
                lineWidth: randomFloat(lineWidth.explosion.min, lineWidth.explosion.max),
                explosionLength: floor(explosion),
                brightness,
                decay
            }));
        }
    }
    drawExplosion() {
        let length = this.explosions.length;
        while (length--) {
            this.explosions[length].draw();
            this.explosions[length].update(() => {
                this.explosions.splice(length, 1);
            });
        }
    }
}
export class Star {
    constructor(container) {
        var dom = document.createElement("div");
        dom.classList.add("star");
        document.body.append(dom);
        
        function init(dom) {
            dom.classList.remove("twinkle");
            dom.style.top = randomInt(0, container.clientHeight) + "px";
            dom.style.left = randomInt(0, container.clientWidth) + "px";
            dom.style.animationDuration = randomInt(100, 1500) + "ms";
            dom.classList.add("twinkle");
        }
        
        init(dom);
        
        dom.addEventListener("animationend", function() {
            init(dom);
        });
    }
}
