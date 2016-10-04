import {WebGLUtils} from "./wgl_ts/webgl_utils.ts";

window.onload = () => {

    let canvas = document.createElement ("canvas");
    canvas.id = "gl-canvas";

    document.body.appendChild(canvas);

    let wgl_utils : WebGLUtils = new WebGLUtils ();

    let gl = wgl_utils.setupWebGL (canvas as HTMLCanvasElement, []);
    if (!gl) { 
        alert( "WebGL isn't available" ); 
    }
};

