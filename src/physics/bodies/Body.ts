import {vec2, vec3} from "gl-matrix";
import CollisionArea from "../collision/CollisionArea";
import Shape from "../../rendering/shapes/Shape";
import Square from "../../rendering/shapes/Square";
import StepIntegrator from "../integration/StepIntegrator";
import VelocityVerletIntegrator from "../integration/VelocityVerletIntegrator";

export default class Body {
    // Incremented every time a new body is created.
    public static nextID :number = 0;

    // TODO: units are still treated as px/sec. Fix
    private _id :number;
    public position :vec2;
    public velocity :vec2;
    private _acceleration :vec2;
    private _oldAcceleration: vec2;
    public oldPosition :vec2;
    public oldVelocity :vec2;
    public angle :number;
    public angularVelocity :number;
    public oldAngularVelocity :number;
    private _angularAcceleration :number;
    private _oldAngularAcceleration :number;
    public torque :number;
    public force :vec2;
    public mass :number;
    public momentOfInertia :number;
    public restitutionCoefficient :number;
    public width :number;
    public height :number;

    // Shape representing the physical object graphically.
    public shape :Shape;

    // Update callback.
    protected updateCallback: (body : Body, deltaTime : number) => void;

    // Step integration method to be used. 
    // TO DO: take method from World setting.
    private stepIntegrator :StepIntegrator;

    constructor(position :vec2, width :number, height :number) {
        this._id = Body.nextID++;
        this.position = vec2.clone(position);
        this.width = width;
        this.height = height;
        this.shape = new Square(vec3.fromValues(this.position[0], this.position[1],0), this.width, this.height);
        this.mass = 1;
        this.torque = 0;
        this.momentOfInertia = 1;
        this.velocity = vec2.create();
        this._acceleration = vec2.create();
        this._oldAcceleration = vec2.clone(this._acceleration);
        this.angle = 0;
        this.angularVelocity = 0;
        this._angularAcceleration = this.torque / this.momentOfInertia;
        this._oldAngularAcceleration = this._angularAcceleration;
        this.force = vec2.create();
        this.updateCallback = (body :Body, deltaTime :number) => {};
        this.stepIntegrator = new VelocityVerletIntegrator();
    }

    // Integrates body's state, updating position, velocities and rotation. Time must be given in seconds.
    public integrate(dt: number) {
        this.stepIntegrator.integrate(this, dt);
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


}