import {vec2, vec3, mat4, quat} from "gl-matrix";
import CollisionArea from "../collision/CollisionArea";
import CollisionManifold from "../collision/CollisionManifold";
import Shape from "../../rendering/shapes/Shape";
import RectangleShape from "../../rendering/shapes/RectangleShape";
import StepIntegrator from "../integration/StepIntegrator";
import VelocityVerletIntegrator from "../integration/VelocityVerletIntegrator";
import BodyDefinition from "./BodyDefinition";
import IgniEngine from "../../engine/IgniEngine";
import {KeyboardInteractable} from "../../input/Interactable";
import {KeyboardEventInfo} from "../../input/EventInfo"; 
import {KeyboardEvents} from "../../input/InputEvents";

abstract class Body implements CollisionArea, KeyboardInteractable {
    // Incremented every time a new body is created.
    public static nextID :number = 0;
    
    // Reference to the parent engine.
    private _engine :IgniEngine;

    // TODO: units are still treated as px/sec. Fix
    private _id :number;
    public position :vec2;
    public isStaticBody :boolean;
    public velocity :vec2;
    protected _acceleration :vec2;
    protected _oldAcceleration: vec2;
    public oldPosition :vec2;
    public oldVelocity :vec2;
    public angle :number;
    public angularVelocity :number;
    public oldAngularVelocity :number;
    protected _angularAcceleration :number;
    protected _oldAngularAcceleration :number;
    public torque :number;
    public force :vec2;
    public mass :number;
    public momentOfInertia :number;
    protected _invMass :number;
    protected _invMomentOfInertia :number;
    public restitutionCoefficient :number;
    public staticFrictionCoefficient :number;
    public dynamicFrictionCoefficient :number;

    // Accumulated deltas for collision resolution.
    public dPosition :vec2;
    public dVelocity :vec2;
    public dAngularVelocity :number;

    // Transforms vertices and features to world coordinates.
    protected _transform :mat4;
    // Transforms normals to world coordinates.
    protected _inverseTranposeTransform :mat4;

    // Shape representing the object graphically to rendering.
    public visualShape :Shape;

    // Shape representing the object physically to physics simulation.
    public physicalShape :Shape;

    // Update callback.
    protected updateCallback: (body : Body, deltaTime : number) => void;

    // Collision callback.
    protected collisionCallback: (collisionManifold :CollisionManifold) => void;

    // Step integration method to be used. 
    // TO DO: take method from World setting.
    private stepIntegrator :StepIntegrator;

    constructor(bodyDef :BodyDefinition) {
        this._id = Body.nextID++;
        this._engine = null;

        if(!bodyDef) bodyDef = <BodyDefinition>{ position: vec2.create() };

        bodyDef.position = bodyDef.position || vec2.create();
        bodyDef.isStaticBody = bodyDef.isStaticBody || false;
        bodyDef.angle = bodyDef.angle || 0.0;
        bodyDef.velocity = bodyDef.velocity || vec2.create();
        bodyDef.angularVelocity = bodyDef.angularVelocity || 0.0;
        bodyDef.force = bodyDef.force || vec2.create();
        bodyDef.torque = bodyDef.torque || 0.0;
        bodyDef.mass = bodyDef.mass || 0.0;
        bodyDef.restitutionCoefficient = bodyDef.restitutionCoefficient || 0.8;
        bodyDef.staticFrictionCoefficient = bodyDef.staticFrictionCoefficient || 0.25;
        bodyDef.dynamicFrictionCoefficient = bodyDef.dynamicFrictionCoefficient || 0.20;
        bodyDef.updateCallback = bodyDef.updateCallback || ((body :Body, deltaTime :number) => {});
        bodyDef.collisionCallback = bodyDef.collisionCallback || ((collisionManifold :CollisionManifold) => {});
        bodyDef.stepIntegrator = bodyDef.stepIntegrator || new VelocityVerletIntegrator();

        this.position = vec2.clone(bodyDef.position);
        this.isStaticBody = bodyDef.isStaticBody;
        this.angle = bodyDef.angle;
        this.velocity = vec2.clone(bodyDef.velocity);
        this.angularVelocity = bodyDef.angularVelocity;
        this.force = vec2.clone(bodyDef.force);
        this.torque = bodyDef.torque;
        this.mass = bodyDef.mass;
        this.restitutionCoefficient = bodyDef.restitutionCoefficient;
        this.staticFrictionCoefficient = bodyDef.staticFrictionCoefficient;
        this.dynamicFrictionCoefficient = bodyDef.dynamicFrictionCoefficient;
        this.updateCallback = bodyDef.updateCallback;
        this.collisionCallback = bodyDef.collisionCallback;
        this.stepIntegrator = bodyDef.stepIntegrator;

        if (this.mass == 0.0) {
            this._invMass = 0.0;
        }
        else {
            this._invMass = 1 / this.mass;
        }
        this.dPosition = vec2.create();
        this.dVelocity = vec2.create();
        this.dAngularVelocity = 0.0;
        this._acceleration = vec2.scale(vec2.create(), this.force, this._invMass);
        this._oldAcceleration = vec2.clone(this._acceleration);
        this._transform = mat4.create();
        this._inverseTranposeTransform = mat4.create();
        this.updateTransforms();
    }

    // Calculates moment of intertia from the body's shape.
    public abstract calculateMoI() :number;

    // Integrates body's state, updating position, velocities and rotation. Time must be given in seconds.
    public integrate(time :number, dt: number) {
        this.stepIntegrator.integrate(this, time, dt);
    }

    public update(deltaTime : number) {
        this.updateCallback(this, deltaTime);
    }

    public preCollisionCallback(collisionManifold :CollisionManifold) {
        this.collisionCallback(collisionManifold);
    }

    public onUpdate(updateCallback :(body :Body, deltaTime : number) => void) {
        this.updateCallback = updateCallback;
    }

    /**
     * Update body's visual shape transform and returns it.
     */  
    public getLatestVisualShape() :Shape {
        this.visualShape.setPosition(this.position);
        this.visualShape.setRotation(this.angle);
        return this.visualShape;
    }

    /**
     * Update body's physical shape transform and returns it.
     */
    public getLatestPhysicalShape() :Shape {
        this.physicalShape.setPosition(this.position);
        this.physicalShape.setRotation(this.angle);
        return this.physicalShape;
    }

    public abstract getWorldVertices() :vec2[];

    public abstract contains(point :vec2) :boolean;

    public abstract collide(body :Body) :CollisionManifold;

    public abstract getWorldAxes() :vec2[];

    public abstract extremeVertex(direction :vec2) :[vec2, number];

    public abstract extremeEdge(direction :vec2) :[vec2, vec2];
    
    public abstract project(direction :vec2) :[number, number];

    protected updateTransforms() :void {
        let q : quat = quat.create ();
        quat.setAxisAngle (q, [0,0,1], this.angle);

        this._transform = mat4.fromRotationTranslationScale (this._transform,
            q, vec3.fromValues(this.position[0], this.position[1], 0.0), vec3.fromValues(1.0, 1.0, 1.0));
        this._inverseTranposeTransform = mat4.invert(this._inverseTranposeTransform, 
                                            mat4.transpose(this._inverseTranposeTransform, this._transform));
    }

    // Applies the accumulated collision-related changes in velocity and position to the body.
    public applyResolution() {
        // Apply deltas.
        this.angularVelocity += this.dAngularVelocity;
        vec2.add(this.position, this.position, this.dPosition);
        vec2.add(this.velocity, this.velocity, this.dVelocity);

        // Reset deltas.
        vec2.set(this.dVelocity, 0.0, 0.0);
        vec2.set(this.dPosition, 0.0, 0.0);
        this.dAngularVelocity = 0.0;
    }

    public onKeyDown(handler :(target :Shape | Body, event_info? :KeyboardEventInfo) => void) {
        if(!this._engine) {
            console.error("This body is not attached to any engine object!");
            return;
        }
        this._engine.subscribeTo(KeyboardEvents.KEYDOWN, this, handler);
    }
    public onKeyUp(handler :(target :Shape | Body, event_info? :KeyboardEventInfo) => void) {
        if(!this._engine) {
            console.error("This body is not attached to any engine object!");
            return;
        }
        this._engine.subscribeTo(KeyboardEvents.KEYDOWN, this, handler);
    }
    public onKeyPressed(handler :(target :Shape | Body, event_info? :KeyboardEventInfo) => void) {
        if(!this._engine) {
            console.error("This body is not attached to any engine object!");
            return;
        }
        this._engine.subscribeTo(KeyboardEvents.KEYDOWN, this, handler);    
    }

    public get acceleration() :vec2 {
        return this._acceleration;
    }

    public set acceleration(acc :vec2) {
        this._acceleration = acc;
    }

    public get oldAcceleration() :vec2 {
        return this._oldAcceleration;
    }

    public set oldAcceleration(acc :vec2) {
        this._oldAcceleration = acc;
    }

    public get angularAcceleration() :number {
        return this._angularAcceleration;
    }

    public set angularAcceleration(angular_acc :number) {
        this._angularAcceleration = angular_acc;
    }

    public get oldAngularAcceleration() :number {
        return this._oldAngularAcceleration;
    }

    public set oldAngularAcceleration(angular_acc :number) {
        this._oldAngularAcceleration = angular_acc;
    }

    public get invMass() :number {
        return this._invMass;
    }

    public get invMomentOfInertia() :number {
        return this._invMomentOfInertia;
    }

    public set engine(game :IgniEngine) {
        this._engine = game;
    }
}
export default Body;