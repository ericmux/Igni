import Body from "./bodies/Body";
import CollisionManifold from "./collision/CollisionManifold";
import CollisionDetector from "./collision/CollisionDetector";
import BruteForceCollisionDetector from "./collision/BruteForceCollisionDetector";

export default class World {
    private _bodies :Body[];
    private _collisionDetector :CollisionDetector;
    private _collisionManifolds :CollisionManifold[];


    constructor() {
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

    public detectCollisions() {
        this._collisionManifolds = this._collisionDetector.detect(this._bodies);
        console.log(this._collisionManifolds.length);
    }


    public get bodies() :Body[] {
        return this._bodies;
    }
}