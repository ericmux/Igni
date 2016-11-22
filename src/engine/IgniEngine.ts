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
    private _debugMode : boolean;

    private _running : boolean;
    private _resetTimers : boolean;

    /**
     * Determine in how many pieces the physics engine will simulate
     * one of its steps. The bigger the more precise the simulation.
     */
    private _physicsIteration: number;

    /**
     * Keep timing and framing info centralized
     */
    private clock : IClock;
    
    /** 
     * Resource Loader. 
     */
    public loader : Loader; 

    constructor(canvas :HTMLCanvasElement, camera :Shape, opts? : EngineOptions) {
        this.world = new World();
        this.renderer = new WGLRenderer (canvas, <WGLOptions> { depth_test: false, blend: true });
        this.renderer.setCamera(camera);

        this.loader = new Loader ();
        this._textureManager = new TextureManager (new Dictionary<string, WGLTexture> ());

        this._physicsIteration = (opts !== undefined ) ? opts.iterationsPerPhysicsTick || 4 : 4;

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
            this._debugMode = false;
        }
    }

    public addShape(shape: Shape) :void {
        this.bodylessShapes.push(shape);
    }

    public addBody(body : Body) :void {
        this.world.addBody(body);
    }

    private initTimers () {
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

    private resetTimers (frameTime :number) {
        this.clock.lastPhysicsTick = frameTime;
        this.clock.lastFrameTime = frameTime;
        this.clock.frameCount = 0;

        if(this._debugMode) {
            // force a frame to always run (really hacky).
            // TODO(econrado): come up with a better solution.
            this.clock.lastFrameTime -= 1.2*this.clock.physicsUpdatePeriod;
            this.clock.lastPhysicsTick -= 1.2*this.clock.physicsUpdatePeriod;
        }
    }

    /**
     * Reference to the Game Loop function. It invokes {processFrame}.
     * The difference is {gameLoop} schedules the next raF.
     */
    private gameLoop = (frameTime : number) => {
        this.lastFrameID = window.requestAnimationFrame(this.gameLoop);
        
        // Run next frame.
        this.runFrame (frameTime);
    };
    
    /**
     * Single frame code, with no raF callback
     */
    private runFrame = (frameTime : number) => {
        // reset timers if resuming from pause.
        if(this._resetTimers) {
            this.resetTimers(frameTime);
            this._resetTimers = false;
        }

        this.clock.deltaTime = (frameTime - this.clock.lastFrameTime);
  
        //  Comment these 5 lines below because they are not a good solution for what they purpose
        //Clamp delta time if the tab has lost focus. 
        // if(this.clock.deltaTime > 1.2*this.clock.physicsUpdatePeriod) {
        //     this.resetTimers(frameTime);
        //     this.clock.deltaTime = (frameTime - this.clock.lastFrameTime);
        // }

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

        let tinyStep = this.clock.physicsUpdatePeriod/this._physicsIteration;
        
        // Physics engine update loop.
        for (let i = 0; i < physicsTicks; ++i) {
            for (let j = 0; j < this._physicsIteration; ++j) {
                this.clock.lastPhysicsTick += tinyStep;

                // Step simulation.
                this.world.step(this.clock.lastPhysicsTick/1000, tinyStep/1000);

                // resolve collisions.
                this.world.detectCollisions(this._debugDraw, this.debugRenderables);
                this.world.resolveCollisions();
            }

        }

        // Draw
        this.renderer.beforeRender();
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
    }

    /**
     * IgniEngine begins here
     */
    public start() {

        // Reset all timers for a fresh simulation.
        this.initTimers();

        //  Start 
        this.gameLoop(performance.now ());
        this._running = true;
        this._resetTimers = false;
    }

    /**
     * Blocks successive raF calls, stopping engine work.
     * If you still want frames to be processed, but stops based-time
     * simulation, set {timeScale} to zero, instead. 
     */
    public stop() {
        if (this._running) {
            window.cancelAnimationFrame(this.lastFrameID);
            this.clock.pausedAt = this.clock.lastFrameTime;
            this._running = false;
            this._resetTimers = true;
        }
    }

    /**
     * Continue to request Animation Frames
     */
    public resume () {
        if (!this._running) {
            window.requestAnimationFrame(this.gameLoop);
            this._running = true;
        }
    }

    /**
     * Process one more frame. Used only for debug.
     */
    private resumeFrame () {
        this.stop ();
        window.requestAnimationFrame(this.runFrame);
        this._running = true;
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
            this._debugMode = true;
            this.resumeFrame ();
        } break;
    }
}