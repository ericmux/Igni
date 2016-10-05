import {WGL} from "./wgl_ts/wgl.ts";

window.onload = () => {

    let canvas = document.createElement ("canvas"); 
    canvas.id = "gl-canvas";
    canvas.width = 500;
    canvas.height = 500;

    document.body.appendChild(canvas);

    let wgl : WGL = new WGL (canvas, null);
    wgl.draw ();
};
