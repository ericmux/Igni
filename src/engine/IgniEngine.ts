import Engine from "./Engine";
import Shape from "../rendering/shapes/Shape";
import Renderer from "../rendering/renderers/Renderer";
import {WGLRenderer, WGLOptions} from "../rendering/renderers/WGLRenderer";

export default class IgniEngine implements Engine {

    private shapes: Shape[];
    private renderer: Renderer;
    private lastFrameID: number;

    //  Frame timers
    private deltaTime : number;
    private lastFrameTime : number
    
    //  Physics timers
    private physicsUpdatePeriod : number;
    private lastPhysicsTick : number;

    constructor(canvas :HTMLCanvasElement) {
        this.shapes = []; 
        this.renderer = new WGLRenderer (canvas, <WGLOptions> { depth_test: false, blend: true });
    }

    public add(shape: Shape) :void {
        this.shapes.push(shape);
    }

    private init () {
        this.physicsUpdatePeriod = 33; // in ms (~30fps)
        this.lastPhysicsTick = performance.now (); 
        
        this.deltaTime = 0;
        this.lastFrameTime = this.lastPhysicsTick;
    }

    public start() {
        /*
        *  FrameTime is a browser passed parameter in ms
        */
        let gameLoop : (frameTime : number) => void = (frameTime : number) => {
            this.lastFrameID = window.requestAnimationFrame(gameLoop);
            this.deltaTime = frameTime - this.lastFrameTime;

            let physicsTicks : number = 0;
            let nextPhysTick : number = this.lastPhysicsTick + this.physicsUpdatePeriod;

            //  If frame time < nextPhysicsTick, no physics update to get done
            //  If frame time >= nextPhysicsTick, then..
            if (frameTime >= nextPhysTick) {
                physicsTicks = Math.floor ((frameTime - this.lastPhysicsTick) /
                                            this.physicsUpdatePeriod);
            }

            // Physics engine update loop.
            for (let i = 0; i < physicsTicks; ++i) {
                this.lastPhysicsTick += this.physicsUpdatePeriod;
                for(let shape of this.shapes) {
                    shape.update(this.physicsUpdatePeriod/1000);
                }
            }

            //  Update Pattern
            

            // Draw
            this.renderer.clear();
            this.renderer.drawShapes(this.shapes);
        
            this.lastFrameTime = frameTime;
        };

        this.init ();
        gameLoop(performance.now ());
    }

    public stop() {
        window.cancelAnimationFrame(this.lastFrameID);
    }

    // Resize canvas to adjust resolution.
	public resizeToCanvas() {
        this.renderer.resizeToCanvas();
	}

}