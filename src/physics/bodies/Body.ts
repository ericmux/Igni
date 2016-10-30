import {vec2, vec3} from "gl-matrix";
import CollisionArea from "../collision/CollisionArea";
import Shape from "../../rendering/shapes/Shape";
import Square from "../../rendering/shapes/Square";
import StepIntegrator from "../integration/StepIntegrator";
import VelocityVerletIntegrator from "../integration/VelocityVerletIntegrator";
import BodyDefinition from "./BodyDefinition";

abstract class Body {
    // Incremented every time a new body is created.
    public static nextID :number = 0;

    // TODO: units are still treated as px/sec. Fix
    private _id :number;
    public position :vec2;
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

    // Shape representing the physical object graphically.
    public shape :Shape;

    // Update callback.
    protected updateCallback: (body : Body, deltaTime : number) => void;

    // Step integration method to be used. 
    // TO DO: take method from World setting.
    private stepIntegrator :StepIntegrator;

    constructor(bodyDef :BodyDefinition) {
        this._id = Body.nextID++;

        if(!bodyDef) bodyDef = <BodyDefinition>{ position: vec2.create() };

        bodyDef.position = bodyDef.position || vec2.create();
        bodyDef.angle = bodyDef.angle || 0.0;
        bodyDef.velocity = bodyDef.velocity || vec2.create();
        bodyDef.angularVelocity = bodyDef.angularVelocity || 0.0;
        bodyDef.force = bodyDef.force || vec2.create();
        bodyDef.torque = bodyDef.torque || 0.0;
        bodyDef.mass = bodyDef.mass || 0.0;
        bodyDef.restitutionCoefficient = bodyDef.restitutionCoefficient || 1.0;
        bodyDef.updateCallback = bodyDef.updateCallback || ((body :Body, deltaTime :number) => {});
        bodyDef.stepIntegrator = bodyDef.stepIntegrator || new VelocityVerletIntegrator();

        this.position = vec2.clone(bodyDef.position);
        this.angle = bodyDef.angle;
        this.velocity = vec2.clone(bodyDef.velocity);
        this.angularVelocity = bodyDef.angularVelocity;
        this.force = vec2.clone(bodyDef.force);
        this.torque = bodyDef.torque;
        this.mass = bodyDef.mass;
        this.restitutionCoefficient = bodyDef.restitutionCoefficient;
        this.updateCallback = bodyDef.updateCallback;
        this.stepIntegrator = bodyDef.stepIntegrator;

        if (this.mass == 0.0) {
            this._invMass = 0.0;
        }
        else {
            this._invMass = 1 / this.mass;
        }
        this._acceleration = vec2.scale(vec2.create(), this.force, this._invMass);
        this._oldAcceleration = vec2.clone(this._acceleration);
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

    public onUpdate(updateCallback :(body :Body, deltaTime : number) => void) {
        this.updateCallback = updateCallback;
    }

    // updates shape's transform and returns it. 
    public getLatestShape() :Shape {
        this.shape.setPosition(this.position);
        this.shape.setRotation(this.angle);
        return this.shape;
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
}
export default Body;