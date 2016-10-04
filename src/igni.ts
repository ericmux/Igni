import setupWebGL from "./wgl_ts/webgl_utils.ts";

window.onload = () => {

    let canvas = document.createElement ("canvas");
    canvas.id = "gl-canvas";

    document.body.appendChild(canvas);

    let gl = setupWebGL (canvas as HTMLCanvasElement, []);
    if (!gl) { 
        alert( "WebGL isn't available" ); 
    }
};

