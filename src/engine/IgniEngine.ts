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
		setInterval(() => {
            // Update loop.
            for(let shape of this.shapes) {
                shape.update();
            }

			this.renderer.clear();
            this.renderer.drawShapes(this.shapes);
		}, 16.7);
    }

    // Resize canvas to adjust resolution.
	public resizeToCanvas() {
        this.renderer.resizeToCanvas();
	}

}