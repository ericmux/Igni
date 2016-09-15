import {AABB} from "./bodies/aabb.ts";
import $ = require('jquery');

function greeter(x: number, y: number) {
    return "Position: " + x + ", " + y;
}

var rect = new AABB(5,10);

$(() => {
    $(document.body).append("<p>" + greeter(rect.x, rect.y) + "</p>");
});