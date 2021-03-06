import {vec2} from "gl-matrix";
import StepIntegrator from "./StepIntegrator";
import Body from "../bodies/Body";

export default class SemiImplicitEulerIntegrator implements StepIntegrator {
    public integrate(body :Body, time: number, dt :number) {
       // calculate acceleration.
       body.oldAcceleration = vec2.clone(body.acceleration);
       body.acceleration = vec2.scale(vec2.create(), body.force, 1/body.mass);

       // update velocity.
       body.oldVelocity = vec2.clone(body.velocity);
       vec2.scaleAndAdd(body.velocity, body.velocity, body.acceleration, dt);

       // update position.
       vec2.scaleAndAdd(body.position, body.position, vec2.clone(body.velocity), dt);

       // calculate angular acceleration.
       body.oldAngularAcceleration = body.angularAcceleration;
       body.angularAcceleration = body.torque / body.momentOfInertia;

       // update angular velocity.
       body.oldAngularVelocity = body.angularVelocity;
       body.angularVelocity += body.angularAcceleration * dt;

       // update angle. 
       body.angle += body.angularVelocity * dt;
    }
}