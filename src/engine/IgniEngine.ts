import Engine from "./Engine";
import Shape from "../rendering/shapes/Shape";
import Renderer from "../rendering/renderers/Renderer";
import Camera from "../rendering/camera/Camera";
import {WGLRenderer, WGLOptions} from "../rendering/renderers/WGLRenderer";
import Body from "../physics/bodies/Body";
import World from "../physics/World";
import {Loader} from "../loader/Loader";
import {IClock} from "../utils/IClock";

export default class IgniEngine implements Engine {

    private bodylessShapes: Shape[] = [];
    private world: World;
    private renderer: Renderer;
    private lastFrameID: number;
    
    /**
     * Reference to the Game Loop function. Grab it to use it in
     * a context safe manner.
     */
    private gameLoop : (frameTime : number) => void;
    
    /**
     * Reference to the restart function. When restarting, we wait one
     * to be fired, catch that frameTime, and use it to update Clock's 
     * timing.
     */
    private restartInternal : (frameTime : number) => void;

    /**
     * Keep timing and framing info centralized
     */
    private clock : IClock;

    /**
     * Controls time flows. Values bigger than 1 are not valid.
     * If 1 the simulation goes on 'standard' velocity. If < 1
     * simulation goes slower. If < 0, simulation is stopped, 
     * but frames continue to be processed.
     * 
     */
    public timeScale : number;
    
    /** 
     * Resource Loader. 
     */
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

        let performanceNow = performance.now ();

        this.clock = <IClock> {
            physicsUpdatePeriod : (1000/60), // in ms (~60fps),
            lastPhysicsTick : performanceNow,
            deltaTime : 0,
            lastFrameTime : performanceNow,
            frameCount : 0,
            pausedTime : 0,
            pausedAt : 0,
            framePhysicsSteps : 0
        };

        /*
        *  FrameTime is a browser passed parameter in ms
        */
        return (frameTime : number) => {
            this.lastFrameID = window.requestAnimationFrame(this.gameLoop);
            
            this.clock.deltaTime = frameTime - this.clock.lastFrameTime;

            let physicsTicks : number = 0;
            let nextPhysTick : number = this.clock.lastPhysicsTick + this.clock.physicsUpdatePeriod;

            //  If frame time < nextPhysicsTick, no physics update to get done
            //  If frame time >= nextPhysicsTick, then..
            if (frameTime >= nextPhysTick) {
                physicsTicks = Math.floor ((frameTime - this.clock.lastPhysicsTick) /
                                            this.clock.physicsUpdatePeriod);
            }

            //  Update Pattern
            for(let shape of this.bodylessShapes) {
                shape.update(this.clock.deltaTime/1000);
            }
            this.world.update(this.clock.deltaTime/1000);

            // Physics engine update loop.
            for (let i = 0; i < physicsTicks; ++i) {
                this.clock.lastPhysicsTick += this.clock.physicsUpdatePeriod;
                this.world.detectCollisions();
                // resolve collisions.
                this.world.step(this.clock.lastPhysicsTick/1000, this.clock.physicsUpdatePeriod/1000);
            }

            // Draw
            this.renderer.clear();
            for (let body of this.world.bodies) {
                this.renderer.drawShape(body.getLatestShape());
            }
            for (let shape of this.bodylessShapes) {
                this.renderer.drawShape(shape);
            }

            ++this.clock.frameCount;
            this.clock.framePhysicsSteps = physicsTicks;

            this.clock.lastFrameTime = frameTime;
        };
    }
    
    /**
     * Use this function's return to catch a frame, and then pass 
     * to other parts of the loop the correct frameTime 
     */
    private prepareRestart () {

        return (frameTime : number) => {
            
            this.clock.pausedTime = frameTime - this.clock.pausedAt;
            
            this.clock.lastFrameTime += this.clock.pausedTime;
            this.clock.lastPhysicsTick += this.clock.pausedTime;

            this.gameLoop (frameTime);
        }
    }

    /**
     * IgniEngine begins here
     */
    public start() {
        
        //  Grab references to these functions on context safe way
        this.gameLoop = this.init ();
        this.restartInternal = this.prepareRestart ();

        //  Start 
        this.gameLoop(performance.now ());
    }

    /**
     * Continue to request Animation Frames
     */
    public resume () {
         window.requestAnimationFrame(this.restartInternal);
    }

    /**
     * Blocks successive raF calls, stopping engine work.
     * If you still want frames to be processed, but stops based-time
     * simulation, set {timeScale} to zero, instead. 
     */
    public stop() {
        window.cancelAnimationFrame(this.lastFrameID);
        this.clock.pausedAt = this.clock.lastFrameTime;
    }

    /**
     * Resize canvas to adjust resolution.
     */
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