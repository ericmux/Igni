import Engine from "./Engine";
import Shape from "../rendering/shapes/Shape";
import Renderer from "../rendering/renderers/Renderer";
import {WGLRenderer} from "../rendering/renderers/WGLRenderer";

export default class IgniEngine implements Engine {

    private shapes: Shape[];
    private renderer: Renderer;

    constructor(canvas :HTMLCanvasElement) {
        this.shapes = [];
        this.renderer = new WGLRenderer (canvas, null);
    }

    public add(shape: Shape) :void {
        this.shapes.push(shape);
    }

    public start() {
		let t : number = 0;
		let inc : number = 1;

		setInterval(() => {
			this.renderer.clear();
			// this.square.translate(vec2.fromValues(inc, 0.0));

			// this.activeShader.render(this.square.toDrawCall(this.projection_matrix));

			t += inc;
			if (t == 100) inc = -1;
			else if (t == -100) inc = 1;
		}, 16.7);
    }

    // Resize canvas to adjust resolution.
	public resizeToCanvas() {
    this.renderer.resizeToCanvas();
	}

}