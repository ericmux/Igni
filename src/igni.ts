require("../dist/index.html");
import {WGLRenderer} from "./rendering/renderers/WGLRenderer.ts";
import IgniEngine from "./engine/IgniEngine";

let canvas : HTMLCanvasElement;
let game : IgniEngine;

window.onload = () => {
    canvas = <HTMLCanvasElement> document.getElementById("gl-canvas"); 
    game = new IgniEngine(canvas);
    game.start();
}

window.onresize = () => {
    game.resizeToCanvas();
}

