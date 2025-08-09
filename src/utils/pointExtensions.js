import { Point } from "pixi.js";

export function extendPointPrototype() {
    Point.prototype.rotate = function(angle, unit = "rad") {
        const addAngle = unit === "deg" ? angle * ( Math.PI / 180 ) : angle

        const startAngle = Math.atan2(this.y, this.x)

        const newAngle = startAngle + addAngle

        const x = Math.cos(newAngle)
        const y = Math.sin(newAngle)

        return new Point(x, y)
    }
}