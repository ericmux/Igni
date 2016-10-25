import {vec2} from "gl-matrix";
import StepIntegrator from "./StepIntegrator";
import Body from "../bodies/Body";

export default class VelocityVerlet implements StepIntegrator {
    public integrate(body :Body, dt :number) {
       // update position.
       vec2.scaleAndAdd(body.position, body.position, vec2.clone(body.velocity), dt);
       vec2.scaleAndAdd(body.position, body.position, vec2.clone(body.acceleration), dt*dt/2);

       // update velocity.
       body.oldVelocity = body.velocity;
       vec2.scaleAndAdd(body.velocity, body.velocity, vec2.clone(body.acceleration), dt);

       // update angle. 
       body.angle += body.angularVelocity * dt + (body.torque / body.momentOfInertia)*dt*dt/2;
       body.angularVelocity += (body.torque / body.momentOfInertia) * dt;
    }
}