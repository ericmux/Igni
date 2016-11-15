import {vec2} from "gl-matrix";
import {perpendicularize, cross} from "./utils/utils";
import Body from "./bodies/Body";
import CollisionManifold from "./collision/CollisionManifold";
import CollisionDetector from "./collision/CollisionDetector";
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
            let manifold : CollisionManifold = this._collisionManifolds[i];
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
            let staticFrictionCoefficient :number = 0.5*(bodyA.staticFrictionCoefficient + bodyB.staticFrictionCoefficient);
            let dynamicFrictionCoefficient :number = 0.5*(bodyA.dynamicFrictionCoefficient + bodyB.dynamicFrictionCoefficient);

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
            vec2.add(va, 
                    bodyA.velocity, 
                    va);

           let vb = vec2.clone(rb);
            perpendicularize(vb);
            vec2.scale(vb, vb, bodyB.angularVelocity);
            vec2.add(vb, 
                    bodyB.velocity, 
                    vb);

            let rv : vec2 = vec2.sub(vec2.create (), va, vb);
            let rvNormal = vec2.dot(rv, normal);
            let rvTangent = vec2.dot(rv, tangent); 
            
            let raTangent = vec2.dot(ra, tangent);  
            let raNormal = vec2.dot(ra, normal); 
            
            let rbTangent = vec2.dot(rb, tangent); 
            let rbNormal = vec2.dot(rb, normal); 
            
            // If objects are moving away ignore
            if (rvNormal <  0) {
                continue;   
            }

            // Collision impulse formula from Chris Hecker
            // https://en.wikipedia.org/wiki/Collision_response
            var impulseNormal = ((1 + restitutionCoefficient) * rvNormal) /
                ((bodyA.invMass + bodyB.invMass) + bodyA.invMomentOfInertia * raTangent * raTangent + bodyB.invMomentOfInertia * rbTangent * rbTangent); 
            
            if (!bodyA.isStaticBody) {
                vec2.add(bodyA.dVelocity, bodyA.dVelocity, vec2.scale(vec2.create(), normal, -impulseNormal * bodyA.invMass));
                bodyA.dAngularVelocity -= impulseNormal * bodyA.invMomentOfInertia * cross(ra, normal);
            }
            
            if (!bodyB.isStaticBody) {
                vec2.add(bodyB.dVelocity, bodyB.dVelocity, vec2.scale(vec2.create(), normal, impulseNormal * bodyB.invMass));
                bodyB.dAngularVelocity += impulseNormal * bodyB.invMomentOfInertia * cross(rb, normal);
            }

            if (rvTangent !== 0) {
                let maxImpulseFriction = Math.abs(impulseNormal) * dynamicFrictionCoefficient * Math.abs(rvTangent) / rvTangent;
                let impulseFriction = rvTangent / (bodyA.invMass + bodyB.invMass + raNormal * raNormal * bodyA.invMomentOfInertia + rbNormal * rbNormal * bodyB.invMomentOfInertia);

                if (Math.abs(impulseFriction) > Math.abs(maxImpulseFriction)) {
                    impulseFriction = maxImpulseFriction;
                }

                if (!bodyA.isStaticBody) {
                    vec2.add(bodyA.dVelocity, bodyA.dVelocity, vec2.scale(vec2.create(), tangent, -impulseFriction * bodyA.invMass));
                    bodyA.dAngularVelocity -= impulseFriction * bodyA.invMomentOfInertia * cross(ra, tangent);                    
                }

                if (!bodyB.isStaticBody) { 
                    vec2.add(bodyB.dVelocity, bodyB.dVelocity, vec2.scale(vec2.create(), tangent, impulseFriction * bodyB.invMass));
                    bodyB.dAngularVelocity += impulseFriction * bodyB.invMomentOfInertia * cross(rb, tangent);
                }
            }

            //  There shall be no staticBody vs staticBody collisions
            // TO DO(econrado): make sure CollisionJumpTable checks and returns null for pairs with only static bodies.
            if (bodyA.isStaticBody) {
                vec2.add(bodyB.dPosition, bodyB.dPosition, mtv);
            }
            else if (bodyB.isStaticBody) {
                let depen_vector :vec2 = vec2.create ();
                vec2.negate (depen_vector, mtv);
                vec2.add(bodyA.dPosition, bodyA.dPosition, depen_vector);
            }
            // Separate them back according to their masses.
            else {
                let depen_vector :vec2 = vec2.create ();
                depen_vector = vec2.scale(depen_vector, mtv, 1.0 / (bodyA.invMass + bodyB.invMass));
                vec2.scale(depen_vector, depen_vector, bodyB.invMass);
                vec2.add(bodyB.dPosition, bodyB.dPosition, depen_vector);
                vec2.scale(depen_vector, depen_vector, bodyA.invMass / bodyB.invMass);
                vec2.negate(depen_vector, depen_vector);
                vec2.add(bodyA.dPosition, bodyA.dPosition, depen_vector);
            }
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