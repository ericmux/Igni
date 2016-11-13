import {Engine, EngineOptions} from "./Engine";
import Shape from "../rendering/shapes/Shape";
import Renderer from "../rendering/renderers/Renderer";
import Camera from "../rendering/camera/Camera";
import {WGLRenderer, WGLOptions} from "../rendering/renderers/WGLRenderer";
import {TextureManager, WGLTexture} from "../loader/TextureManager";
import {Renderable} from "../rendering/shaders/DrawCall";
import Body from "../physics/bodies/Body";
import World from "../physics/World";
import {Loader} from "../loader/Loader";
import {IClock} from "../utils/IClock";
import {Dictionary} from "../utils/Dictionary";

export default class IgniEngine implements Engine {

    private bodylessShapes: Shape[] = [];
    private debugRenderables: Renderable[] = [];
    private world: World;
    private renderer: Renderer;
    private _textureManager: TextureManager; 
    private lastFrameID: number;
    
    private _debugDraw : boolean;

    private running : boolean;

    /**
     * Reference to the Game Loop function. It invokes {processFrame}.
     * The difference is {gameLoop} schedules the next raF.
     */
    private gameLoop : (frameTime : number) => void;
    
    /**
     * Single frame code, with no raF callback
     */
    private processFrame : (frameTime : number) => void;
    
    /**
     * Reference to the restart function. When restarting, we wait one
     * to be fired, catch that frameTime, and use it to update Clock's 
     * timing.
     */
    private scheduleGameLoop : (frameTime : number) => void;

    /**
     * The same as {scheduleGameLoop}, but it schedules only one frame.
     */
    private scheduleFrame : (frameTime : number) => void;

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
    public set timeScale (timeScale : number) {
        if (timeScale > 1.0) {
            this._timeScale = 1.0;
        }
        else if (timeScale >= 0) {
            this._timeScale = timeScale;
        }
        else {
            this._timeScale = 0;
        }
    }

    /**
     * Value that scales the frame's delta time
     */
    public get timeScale () {
        return this._timeScale;
    }
    
    /** 
     * Resource Loader. 
     */
    public loader : Loader; 

    private _timeScale : number;

    constructor(canvas :HTMLCanvasElement, camera :Shape, opts? : EngineOptions) {
        this.world = new World();
        this.renderer = new WGLRenderer (canvas, <WGLOptions> { depth_test: false, blend: true });
        this.renderer.setCamera(camera);
        
        this.timeScale = 1;

        this.loader = new Loader ();
        this._textureManager = new TextureManager (new Dictionary<string, WGLTexture> ());

        if (this.bodylessShapes.indexOf(camera) === -1){
            this.addShape(camera);
        }

        if (opts !== undefined) {
            //  If bindings not supplied, map to 1,2 and 3 keyboard keys
            if (opts.frameControl) {
            window.document.addEventListener("keydown", debugFrameInput.bind (this, opts.stopKeyBinding || 49, 
                                                                                    opts.resumeKeyBinding || 50,
                                                                                    opts.resumeFrameKeyBinding || 51));
            }
            
            this._debugDraw = opts.debugDraw;
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
    }

    private prepareGameLoop () {
        /*
        *  FrameTime is a browser passed parameter in ms
        */
        return (frameTime : number) => {
            this.lastFrameID = window.requestAnimationFrame(this.gameLoop);
            
            this.processFrame (frameTime);
        };
    }

    private prepareProcessFrame () {

        return (frameTime : number) => {
            this.clock.deltaTime = (frameTime - this.clock.lastFrameTime) * this.timeScale;

            let physicsTicks : number = 0;
            let nextPhysTick : number = this.clock.lastPhysicsTick + this.clock.physicsUpdatePeriod;

            //  If frame time < nextPhysicsTick, no physics update to get done
            //  If frame time >= nextPhysicsTick, then..
            if (frameTime >= nextPhysTick) {
                physicsTicks = Math.floor ((frameTime - this.clock.lastPhysicsTick) /
                                            this.clock.physicsUpdatePeriod);
            }

            //  Renew debug renderables array each frame
            this.debugRenderables.length = 0;

            //  Update Pattern
            for(let shape of this.bodylessShapes) {
                shape.update(this.clock.deltaTime/1000);
            }
            this.world.update(this.clock.deltaTime/1000);

            // Physics engine update loop.
            for (let i = 0; i < physicsTicks; ++i) {
                this.clock.lastPhysicsTick += this.clock.physicsUpdatePeriod;

                // resolve collisions.
                this.world.detectCollisions(this._debugDraw, this.debugRenderables);
                this.world.resolveCollisions();

                this.world.step(this.clock.lastPhysicsTick/1000, this.timeScale * this.clock.physicsUpdatePeriod/1000);
            }

            // Draw
            this.renderer.clear();
            for (let body of this.world.bodies) {
                this.renderer.drawShape(body.getLatestVisualShape());
            }
            for (let shape of this.bodylessShapes) {
                this.renderer.drawShape(shape);
            }
            //  Debug Draw
            for (let renderable of this.debugRenderables) {
                this.renderer.debugDraw (renderable);        
            }

            ++this.clock.frameCount;
            this.clock.framePhysicsSteps = physicsTicks;

            this.clock.lastFrameTime = frameTime;

            if (!this.running) this.clock.pausedAt = frameTime;
        };
    }

    /**
     * Use this function's return to catch a frame, get the correct frameTime
     * and then schedule {resume} with the correct frameTime. 
     * @param resume It is the callback to be called after catching the correct frameTime
     * @param additionalTime? Used for debugging resume with some delta time between frames (additionalTime)
     */
    private prepareResume (resume : (frameTime : number) => void, additionalTime? : number) {

        return (frameTime : number) => {
            
            this.clock.pausedTime = frameTime - this.clock.pausedAt - (additionalTime || 0);
            
            this.clock.lastFrameTime += this.clock.pausedTime;
            this.clock.lastPhysicsTick += this.clock.pausedTime;

            resume (frameTime);
        }
    }

    /**
     * IgniEngine begins here
     */
    public start() {

        this.init ();

        //  Grab references to these functions on context safe way
        this.gameLoop = this.prepareGameLoop ();
        this.processFrame = this.prepareProcessFrame ();
        
        this.scheduleGameLoop = this.prepareResume (this.gameLoop);
        this.scheduleFrame = this.prepareResume (this.processFrame, this.clock.physicsUpdatePeriod);

        //  Start 
        this.gameLoop(performance.now ());

        this.running = true;
    }

    /**
     * Blocks successive raF calls, stopping engine work.
     * If you still want frames to be processed, but stops based-time
     * simulation, set {timeScale} to zero, instead. 
     */
    public stop() {
        if (this.running) {
            window.cancelAnimationFrame(this.lastFrameID);
            this.clock.pausedAt = this.clock.lastFrameTime;

            this.running = false;
        }
    }

    /**
     * Continue to request Animation Frames
     */
    public resume () {
        if (!this.running) {
            window.requestAnimationFrame(this.scheduleGameLoop);
            this.running = true;
        }
    }

    /**
     * Process one more frame. Used only for debug.
     */
    private resumeFrame () {
        this.running = true;

        this.stop ();
        window.requestAnimationFrame(this.scheduleFrame);
        
        this.running = false;
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

    public get textureManager() :TextureManager {
        return this._textureManager;
    }
}

/**
 * Use this for debugging frames.
 * Press keyboard One to stop.
 * Press keyboard Two to resume.
 * Press keyboard Three to process a single frame
 */
function debugFrameInput (stopKey : number, resumeKey : number, resumeFrameKey : number, e : any) {
    
    var event = e || window.event;
    var key = event.keyCode;

    switch (key) {
        case stopKey: {
            this.stop ();
        } break;
        case resumeKey: {
            this.resume ();
        } break;
        case resumeFrameKey: {
            this.resumeFrame ();
        } break;
        case 52: {
            this.timeScale = 1;
        } break;
        case 53: {
            this.timeScale = 0.5; 
        } break;
        case 54: {
            this.timeScale = 0;
        } break;
    }
}