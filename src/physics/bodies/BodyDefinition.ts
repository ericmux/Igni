import {vec2, vec3} from "gl-matrix";
import Body from "../bodies/Body";
import StepIntegrator from "../integration/StepIntegrator";
import CollisionManifold from "../collision/CollisionManifold";
import Shape from "../../rendering/shapes/Shape";

interface BodyDefinition {
    position: vec2;
    isStaticBody?: boolean,
    angle?: number;
    velocity?: vec2;
    angularVelocity?: number;
    force?: vec2;
    torque?: number;
    mass?: number;
    restitutionCoefficient?: number;
    staticFrictionCoefficient?: number;
    dynamicFrictionCoefficient?: number;
    updateCallback?: (body :Body, deltaTime :number) => void;
    collisionCallback?: (collisionManifold :CollisionManifold) => void;
    stepIntegrator?: StepIntegrator;
    visualShape? : Shape
}
export default BodyDefinition;