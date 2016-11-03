import {vec2} from "gl-matrix";
import StepIntegrator from "./StepIntegrator";
import Body from "../bodies/Body";

export default class VelocityVerletIntegrator implements StepIntegrator {
    public integrate(body :Body, time: number, dt :number) {
       // Linear verlet.
       // update position.
       vec2.scaleAndAdd(body.position, body.position, vec2.clone(body.velocity), dt);
       vec2.scaleAndAdd(body.position, body.position, vec2.clone(body.acceleration), dt*dt/2);

       // calculate average acceleration.
       body.oldAcceleration = vec2.clone(body.acceleration);
       body.acceleration = vec2.scale(vec2.create(), body.force, body.invMass);
       let avg_accel :vec2 =  vec2.add(vec2.create(), body.acceleration, body.oldAcceleration);
       vec2.scale(avg_accel, avg_accel, 0.5);

       // update velocity.
       body.oldVelocity = vec2.clone(body.velocity);
       vec2.scaleAndAdd(body.velocity, body.velocity, avg_accel, dt);

       // Angular verlet.
       // update angle. 
       body.angle += body.angularVelocity * dt + body.angularAcceleration*dt*dt/2;

       // calculate average angular acceleration.
       body.oldAngularAcceleration = body.angularAcceleration;
       body.angularAcceleration = body.torque * body.invMomentOfInertia;
       let avg_angular_accel : number = 0.5*(body.oldAngularAcceleration + body.angularAcceleration);

       // update angular velocity.
       body.oldAngularVelocity = body.angularVelocity;
       body.angularVelocity += avg_angular_accel * dt;
    }
}