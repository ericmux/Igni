import {vec2} from "gl-matrix";
import {perpendicularize, cross} from "./utils/utils";
import Body from "./bodies/Body";
import CollisionManifold from "./collision/CollisionManifold";
import CollisionDetector from "./collision/CollisionDetector";
import CollisionSolver from "./collision/CollisionSolver";
import BruteForceCollisionDetector from "./collision/BruteForceCollisionDetector";
import {Renderable} from "../rendering/shaders/DrawCall";

export default class World {
    private _bodies :Body[];
    private _collisionDetector :CollisionDetector;
    private _collisionManifolds :CollisionManifold[];

    constructor () {
        this._bodies = [];
        this._collisionDetector = new BruteForceCollisionDetector();
        this._collisionManifolds = [];
    }

    public addBody(body :Body) {
        this._bodies.push(body);
    }
    
    public removeBody(body :Body) {
        let index : number = this._bodies.indexOf(body);
        if (index !== -1){
            this._bodies.splice(index, 1);
        }
    }

    public update(deltaTime :number) {
        for(let body of this._bodies){
            body.update(deltaTime);
        }
    }

    public step(time: number, dt :number) {
        for(let body of this._bodies) {
            body.integrate(time, dt);
        }
    }

    public detectCollisions(debug? : boolean, debugOut? : Renderable[]) {
        this._collisionManifolds = this._collisionDetector.detect(this._bodies);
        
        if (debug && debugOut !== undefined && debugOut != null) {            
            for (let i = 0; i < this._collisionManifolds.length; ++i) {
                this._collisionManifolds[i].debugRenderables (debugOut);
            }
        }
    }

    public resolveCollisions() {
        if(this._collisionManifolds.length === 0) return;

        for(let i = 0; i < this._collisionManifolds.length; i++) {
            // Solves the collision by accumulating changes to the involved bodies's delta vectors.
            CollisionSolver.resolve(this._collisionManifolds[i]);
        }
        // Apply changes to bodies all at once in the end.
        for(let body of this._bodies) {
            body.applyResolution();        
    
        }

        this._collisionManifolds.length = 0;
    }

    public get bodies() :Body[] {
        return this._bodies;
    }
}