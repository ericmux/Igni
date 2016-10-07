require("../dist/index.html");
import {WGLRenderer} from "./rendering/WGLRenderer.ts";

let canvas : HTMLCanvasElement;
let wgl : WGLRenderer;

window.onload = () => {
    canvas = <HTMLCanvasElement> document.getElementById("gl-canvas"); 
    wgl = new WGLRenderer (canvas, null);
    wgl.draw ();
}

window.onresize = () => {
    wgl.resizeCanvas();
}

