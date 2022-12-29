import { hsla, randomFloat, randomInt } from './helpers.js';
export class Explosion {
    constructor({ x, y, ctx, hue, decay, gravity, friction, brightness, flickering, lineWidth, explosionLength }) {
        this.coordinates = [];
        this.alpha = 1;
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.hue = hue;
        this.gravity = gravity;
        this.friction = friction;
        this.flickering = flickering;
        this.lineWidth = lineWidth;
        this.explosionLength = explosionLength;
        this.angle = randomFloat(0, Math.PI * 2);
        this.speed = randomInt(1, 10);
        this.brightness = randomInt(brightness.min, brightness.max);
        this.decay = randomFloat(decay.min, decay.max);
        while (this.explosionLength--) {
            this.coordinates.push([x, y]);
        }
    }
    update(callback) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;
        if (this.alpha <= this.decay) {
            callback();
        }
    }
    draw() {
        const lastIndex = this.coordinates.length - 1;
        this.ctx.beginPath();
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.fillStyle = hsla(this.hue, this.brightness, this.alpha);
        this.ctx.moveTo(this.coordinates[lastIndex][0], this.coordinates[lastIndex][1]);
        this.ctx.lineTo(this.x, this.y);
        this.ctx.strokeStyle = hsla(this.hue, this.flickering ? randomFloat(0, this.brightness) : this.brightness, this.alpha);
        this.ctx.stroke();
    }
}
