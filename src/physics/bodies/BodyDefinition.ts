import {vec2, vec3} from "gl-matrix";
import Body from "../bodies/Body";
import StepIntegrator from "../integration/StepIntegrator";

interface BodyDefinition {
    position: vec2;
    angle?: number;
    velocity?: vec2;
    angularVelocity?: number;
    force?: vec2;
    torque?: number;
    mass?: number;
    restitutionCoefficient?: number;
    updateCallback?: (body :Body, deltaTime :number) => void;
    stepIntegrator?: StepIntegrator; 
}
export default BodyDefinition;