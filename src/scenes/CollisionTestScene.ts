import {vec2, vec4} from "gl-matrix";
import TestScene from "./TestScene"
import RectangleShape from "../rendering/shapes/RectangleShape";
import Body from "../physics/bodies/Body";
import RectangularBody from "../physics/bodies/RectangularBody";
import CircularBody from "../physics/bodies/CircularBody";
import BodyDefinition from "../physics/bodies/BodyDefinition";
import RectangularBodyDefinition from "../physics/bodies/RectangularBodyDefinition";
import CircularBodyDefinition from "../physics/bodies/CircularBodyDefinition";
import Engine from "../engine/Engine";

export default class CollisionTestScene extends TestScene {
    public static build(game :Engine) :void {

        let checkCollisionFunction = (otherBody :Body) => {
            return (body: Body, deltaTime: number) => {
                let shape :RectangleShape = <RectangleShape> body.shape;
                if (body.collide(otherBody)) {
                    shape.color = vec4.fromValues(Math.random(), Math.random(), Math.random(), 1.0)
                } 
                else {
                    shape.color = vec4.fromValues(1.0,0.0,0.0,1.0);
                } 
            };
        };

        // Add a circular body.
        let body1 : Body = new CircularBody(<CircularBodyDefinition>{
            radius: 30,
            position: vec2.fromValues(60,60),
            mass: 1.0,
            velocity: vec2.fromValues(-30.0, 0),
            torque: 5.0
        });
        let t1 :number = 0;
        body1.onUpdate((body: Body, deltaTime: number) => {
            if (t1 === 200) {
                t1 = 0;
                body.velocity = vec2.negate(vec2.create(), body.velocity);
                body.oldVelocity = vec2.clone(body.velocity);
            }
            t1++;
            checkCollisionFunction(body2)(body, deltaTime);
        });
        game.addBody(body1);

        // Add a circular body.
        let body2 : Body = new CircularBody(<CircularBodyDefinition>{
            position: vec2.fromValues(-60,60),
            radius: 10,
            mass: 1.0,
            velocity: vec2.fromValues(40.0, 0.0)
        });
        let t2 :number = 0;
        body2.onUpdate((body: Body, deltaTime: number) => {
            if (t2 === 200) {
                t2 = 0;
                body.velocity = vec2.negate(vec2.create(), body.velocity);
                body.oldVelocity = vec2.clone(body.velocity);
            }
            t2++;
            checkCollisionFunction(body1)(body, deltaTime);
        });
        game.addBody(body2);  
    }
}