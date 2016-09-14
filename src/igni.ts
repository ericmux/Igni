import {AABB} from "./bodies/aabb.ts";

function greeter(x: number, y: number) {
    return "Position: " + x + ", " + y;
}

var rect = new AABB(5,10);

document.head.innerHTML = greeter(rect.x, rect.y);