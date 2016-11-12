import {vec2} from "gl-matrix";
import {perpendicularize, cross} from "./utils/utils";
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
    }

    public resolveCollisions() {
        for(let manifold of this._collisionManifolds) {
            var bodyA: Body = manifold.bodyA;
            var bodyB: Body = manifold.bodyB;
            var mtv :vec2 = manifold.mtv; 
            var point :vec2 = manifold.point; 
            var normal :vec2 = manifold.normal; 
            if (bodyA === bodyB) {
                return;
            }

            // Call pre-collision callbacks.
            bodyA.preCollisionCallback(manifold);
            bodyB.preCollisionCallback(manifold);
            
            // TODO(econrado): look up for more realistic "e".
            let restitutionCoefficient :number = 0.5*(bodyA.restitutionCoefficient + bodyB.restitutionCoefficient);
            
            let tangent :vec2 = vec2.clone(normal);
            perpendicularize(tangent);
            vec2.normalize(tangent, tangent);
            
            let ra :vec2 =  vec2.sub(vec2.create(), point, bodyA.position); // point relative to bodyA position
            let rb :vec2 =  vec2.sub(vec2.create(), point, bodyB.position); // point relative to bodyB position
            
            // Relative velocity in linear terms
            // Angular to linear velocity formula -> omega = v/r
            let va = vec2.clone(ra);
            perpendicularize(va);
            vec2.scale(va, va, bodyA.angularVelocity);
            vec2.sub(va, 
                    bodyA.velocity, 
                    va);

           let vb = vec2.clone(rb);
            perpendicularize(vb);
            vec2.scale(vb, vb, bodyB.angularVelocity);
            vec2.sub(vb, 
                    bodyB.velocity, 
                    vb);
            let rv : vec2 = vec2.sub(vb, vb, va);
            let rvNormal = vec2.dot(rv, normal);
            let rvTangent = vec2.dot(rv, tangent); 
            
            let raTangent = vec2.dot(ra, tangent);  
            let raNormal = vec2.dot(ra, normal); 
            
            let rbTangent = vec2.dot(rb, tangent); 
            let rbNormal = vec2.dot(rb, normal); 
            
            
            // If objects are moving away ignore
            if (rvNormal >  0) {
                return;   
            }
            
            
            // Collision impulse formula from Chris Hecker
            // https://en.wikipedia.org/wiki/Collision_response
            var impulse = - ((1 + restitutionCoefficient) * rvNormal) /
                ((bodyA.invMass + bodyB.invMass) + bodyA.invMomentOfInertia * raTangent * raTangent + bodyB.invMomentOfInertia * rbTangent * rbTangent); 
            
            
            vec2.add(bodyB.velocity, bodyB.velocity, vec2.scale(vec2.create(), normal, impulse * bodyB.invMass));
            vec2.add(bodyA.velocity, bodyA.velocity, vec2.scale(vec2.create(), normal, -impulse * bodyA.invMass));

            bodyB.angularVelocity -= impulse * bodyB.invMomentOfInertia * cross(vec2.negate(rb, rb), normal);
            bodyA.angularVelocity += impulse * bodyA.invMomentOfInertia * cross(vec2.negate(ra, ra), normal);
            
            // Separate them back according to their masses.
            let percent :number = 1.0;
            let depen_vector :vec2 = vec2.scale(mtv, mtv, percent / (bodyA.invMass + bodyB.invMass));
            vec2.scale(depen_vector, depen_vector, bodyB.invMass);
            vec2.add(bodyB.position, bodyB.position, depen_vector);
            vec2.scale(depen_vector, depen_vector, bodyA.invMass / bodyB.invMass);
            vec2.negate(depen_vector, depen_vector);
            vec2.add(bodyA.position, bodyA.position, depen_vector);
        }
        this._collisionManifolds.length = 0;
    }

    public get bodies() :Body[] {
        return this._bodies;
    }
}