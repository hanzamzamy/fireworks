import { getDistance, hsla, randomInt } from './helpers.js';
export class Trace {
    constructor({ x, y, dx, dy, ctx, hue, speed, traceLength, acceleration }) {
        this.coordinates = [];
        this.currentDistance = 0;
        this.x = x;
        this.y = y;
        this.sx = x;
        this.sy = y;
        this.dx = dx;
        this.dy = dy;
        this.ctx = ctx;
        this.hue = hue;
        this.speed = speed;
        this.traceLength = traceLength;
        this.acceleration = acceleration;
        this.totalDistance = getDistance(x, y, dx, dy);
        this.angle = Math.atan2(dy - y, dx - x);
        this.brightness = randomInt(50, 70);
        while (this.traceLength--) {
            this.coordinates.push([x, y]);
        }
    }
    update(callback) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        this.speed *= this.acceleration;
        const vx = Math.cos(this.angle) * this.speed;
        const vy = Math.sin(this.angle) * this.speed;
        this.currentDistance = getDistance(this.sx, this.sy, this.x + vx, this.y + vy);
        if (this.currentDistance >= this.totalDistance) {
            callback(this.dx, this.dy, this.hue);
        }
        else {
            this.x += vx;
            this.y += vy;
        }
    }
    draw() {
        const lastIndex = this.coordinates.length - 1;
        this.ctx.beginPath();
        this.ctx.moveTo(this.coordinates[lastIndex][0], this.coordinates[lastIndex][1]);
        this.ctx.lineTo(this.x, this.y);
        this.ctx.strokeStyle = hsla(this.hue, this.brightness);
        this.ctx.stroke();
    }
}
