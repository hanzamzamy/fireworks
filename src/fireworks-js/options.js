import { deepMerge } from './helpers.js';
export class Options {
    constructor() {
        this.autoresize = true;
        this.lineStyle = 'round';
        this.flickering = 50;
        this.traceLength = 3;
        this.traceSpeed = 10;
        this.intensity = 30;
        this.explosion = 5;
        this.gravity = 1.5;
        this.opacity = 0.5;
        this.particles = 50;
        this.friction = 0.95;
        this.acceleration = 1.05;
        this.hue = {
            min: 0,
            max: 360
        };
        this.rocketsPoint = {
            min: 50,
            max: 50
        };
        this.lineWidth = {
            explosion: {
                min: 1,
                max: 3
            },
            trace: {
                min: 1,
                max: 2
            }
        };
        this.mouse = {
            click: true,
            move: false,
            max: 1
        };
        this.delay = {
            min: 30,
            max: 60
        };
        this.brightness = {
            min: 50,
            max: 80
        };
        this.decay = {
            min: 0.015,
            max: 0.03
        };
        this.sound = {
            enabled: true,
            files: [
                'src/explosion0.mp3',
                'src/explosion1.mp3',
                'src/explosion2.mp3'
            ],
            volume: {
                min: 5000,
                max: 10000
            }
        };
        this.boundaries = {
            height: 0,
            width: 0,
            x: 50,
            y: 50
        };
    }
    update(options) {
        Object.assign(this, deepMerge(this, options));
    }
}
