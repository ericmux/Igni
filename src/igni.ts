require("../dist/index.html");
import {WGLRenderer} from "./rendering/WGLRenderer.ts";

let canvas : HTMLCanvasElement;
let wgl : WGLRenderer;

// Resize canvas to adjust resolution.
function resizeCanvas(canvas : HTMLCanvasElement) {
    // Lookup the size the browser is displaying the canvas.
    var displayWidth  = canvas.clientWidth;
    var displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    if (canvas.width  != displayWidth ||
        canvas.height != displayHeight) {

        // Make the canvas the same size
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
    }
}

window.onload = () => {
    canvas = <HTMLCanvasElement> document.getElementById("gl-canvas"); 
    wgl = new WGLRenderer (canvas, null);
    wgl.draw ();
}

window.onresize = () => {
    wgl.resizeCanvas();
}

