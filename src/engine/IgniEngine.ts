import Engine from "./Engine";
import Shape from "../rendering/shapes/Shape";
import Renderer from "../rendering/renderers/Renderer";
import Camera from "../rendering/camera/Camera";
import {WGLRenderer, WGLOptions} from "../rendering/renderers/WGLRenderer";
import Body from "../physics/bodies/Body";
import World from "../physics/World";
import {Loader} from "../loader/Loader";

export default class IgniEngine implements Engine {

    private bodylessShapes: Shape[] = [];
    private world: World;
    private renderer: Renderer;
    private lastFrameID: number;

    //  Frame timers
    private deltaTime : number;
    private lastFrameTime : number
    
    //  Physics timers
    private physicsUpdatePeriod : number;
    private lastPhysicsTick : number;

    //  Resource Management
    public loader : Loader; 

    constructor(canvas :HTMLCanvasElement, camera :Shape) {
        this.world = new World();
        this.renderer = new WGLRenderer (canvas, <WGLOptions> { depth_test: false, blend: true });
        this.renderer.setCamera(camera);
        
        this.loader = new Loader ();

        if (this.bodylessShapes.indexOf(camera) === -1){
            this.addShape(camera);
        }
    }

    public addShape(shape: Shape) :void {
        this.bodylessShapes.push(shape);
    }

    public addBody(body : Body) :void {
        this.world.addBody(body);
    }

    private init () {
        this.physicsUpdatePeriod = 1000/60; // in ms (~60fps)
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

            //  Update Pattern
            for(let shape of this.bodylessShapes) {
                shape.update(this.deltaTime/1000);
            }
            this.world.update(this.deltaTime/1000);

            // Physics engine update loop.
            for (let i = 0; i < physicsTicks; ++i) {
                this.lastPhysicsTick += this.physicsUpdatePeriod;
                this.world.detectCollisions();
                // resolve collisions.
                this.world.step(this.lastPhysicsTick/1000, this.physicsUpdatePeriod/1000);
            }

            // Draw
            this.renderer.clear();
            for (let body of this.world.bodies) {
                this.renderer.drawShape(body.getLatestShape());
            }
            for (let shape of this.bodylessShapes) {
                this.renderer.drawShape(shape);
            }
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

    public setCamera(camera : Shape) {
        this.renderer.setCamera(camera);
        
        if (this.bodylessShapes.indexOf(camera) === -1){
            this.addShape(camera);
        }
    }
}