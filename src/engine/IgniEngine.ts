import Engine from "./Engine";
import Shape from "../rendering/shapes/Shape";
import Renderer from "../rendering/renderers/Renderer";
import {WGLRenderer, WGLOptions} from "../rendering/renderers/WGLRenderer";

export default class IgniEngine implements Engine {

    private shapes: Shape[];
    private renderer: Renderer;
    private lastFrameID: number;

    constructor(canvas :HTMLCanvasElement) {
        this.shapes = []; 
        this.renderer = new WGLRenderer (canvas, <WGLOptions> { depth_test: false, blend: true });
    }

    public add(shape: Shape) :void {
        this.shapes.push(shape);
    }

    public start() {

        let gameLoop : () => void = () => {
            this.lastFrameID = window.requestAnimationFrame(gameLoop);

            // Update loop.
            for(let shape of this.shapes) {
                shape.update();
            }

            // Draw.
            this.renderer.clear();
            this.renderer.drawShapes(this.shapes);
        };
        gameLoop();
    }

    public stop() {
        window.cancelAnimationFrame(this.lastFrameID);
    }

    // Resize canvas to adjust resolution.
	public resizeToCanvas() {
        this.renderer.resizeToCanvas();
	}

}