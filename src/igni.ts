import {WGLRenderer} from "./rendering/WGLRenderer.ts";

window.onload = () => {

    let canvas = document.createElement ("canvas"); 
    canvas.id = "gl-canvas";
    canvas.style.width = "100%"; 
    canvas.style.height = "100%";
    canvas.style.display = "block";

    document.body.appendChild(canvas);

    let wgl : WGLRenderer = new WGLRenderer (canvas, null);
    wgl.draw ();
};
