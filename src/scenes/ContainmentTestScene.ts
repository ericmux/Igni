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

export default class ContainmentTestScene extends TestScene {
    public static build(game :Engine) :void {

        let checkContainmentFunction = (point :vec2) => {
            return (body: Body, deltaTime: number) => {
                let shape :RectangleShape = <RectangleShape> body.visualShape;
                if (body.contains(point)) {
                    shape.color = vec4.fromValues(Math.random(), Math.random(), Math.random(), 1.0)
                } 
                else {
                    shape.color = vec4.fromValues(1.0,0.0,0.0,1.0);
                } 
            };
        };

        // Add a rectangular body.
        let body1 : Body = new RectangularBody(<RectangularBodyDefinition>{
            position: vec2.fromValues(60,60),
            width: 30,
            height: 30,
            mass: 1.0,
            velocity: vec2.fromValues(0.0, -50.0),
            torque: 5.0
        });
        let t1 :number = 0;
        body1.onUpdate((body: Body, deltaTime: number) => {
            if (t1 === 100) {
                t1 = 0;
                body.velocity = vec2.negate(vec2.create(), body.velocity);
                body.oldVelocity = vec2.clone(body.velocity);
            }
            t1++;
            checkContainmentFunction(vec2.fromValues(60,0))(body, deltaTime);
        });
        game.addBody(body1);

        // Add a circular body.
        let body2 : Body = new CircularBody(<CircularBodyDefinition>{
            position: vec2.fromValues(30,100),
            radius: 10,
            mass: 1.0,
            velocity: vec2.fromValues(-30.0, 0.0)
        });
        let t2 :number = 0;
        body2.onUpdate((body: Body, deltaTime: number) => {
            if (t2 === 100) {
                t2 = 0;
                body.velocity = vec2.negate(vec2.create(), body.velocity);
                body.oldVelocity = vec2.clone(body.velocity);
            }
            t2++;
            checkContainmentFunction(vec2.fromValues(0,100))(body, deltaTime);
        });
        game.addBody(body2); 

        // // Add a circular body.
        // let body3 : Body = new CircularBody(<CircularBodyDefinition>{
        //     position: vec2.fromValues(30,60),
        //     radius: 10,
        //     mass: 0.5,
        //     force: vec2.fromValues(0.0,-10.0),
        //     velocity: vec2.fromValues(0.0, 50.0)
        // });
        // game.addBody(body3); 

        // Add a YUGE rectangular body.
        let body4 : Body = new RectangularBody(<RectangularBodyDefinition>{
            position: vec2.fromValues(0,0),
            width: 50,
            height: 50,
            mass: 1.0,
            force: vec2.fromValues(0.0,-8.0),
            velocity: vec2.fromValues(0.0, 30.0),
            torque: 5.0
        });
        body4.onUpdate(checkContainmentFunction(vec2.fromValues(0,0)));
        game.addBody(body4);
    }
}