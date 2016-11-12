import {vec2, vec4} from "gl-matrix";
import TestScene from "./TestScene"
import RectangleShape from "../rendering/shapes/RectangleShape";
import Body from "../physics/bodies/Body";
import RectangularBody from "../physics/bodies/RectangularBody";
import CircularBody from "../physics/bodies/CircularBody";
import BodyDefinition from "../physics/bodies/BodyDefinition";
import RectangularBodyDefinition from "../physics/bodies/RectangularBodyDefinition";
import CircularBodyDefinition from "../physics/bodies/CircularBodyDefinition";
import CollisionManifold from "../physics/collision/CollisionManifold";
import Engine from "../engine/Engine";

export default class CollisionTestScene extends TestScene {
    public static build(game :Engine) :void {
        let backAndForthUpdateCallback = (amplitude :number, targetBody :Body) => {
            let t = amplitude/2;
            return (body: Body, deltaTime: number) => {
                if (t === amplitude) {
                    t = 0;
                    body.velocity = vec2.negate(vec2.create(), body.velocity);
                    body.oldVelocity = vec2.clone(body.velocity);
                }
                t++;
            };
        };

        let checkCollisionCallback = (collisionManifold :CollisionManifold) => {
            let color :vec4 = vec4.fromValues(Math.random(), Math.random(), Math.random(), 1.0);
            (<RectangleShape>collisionManifold.bodyA.shape).color = color;
            (<RectangleShape>collisionManifold.bodyB.shape).color = color;
        };

        // PAIR 1
        // Add a circular body.
        let body1 : Body = new CircularBody(<CircularBodyDefinition>{
            radius: 30,
            position: vec2.fromValues(0,60),
            mass: 1.0,
            velocity: vec2.fromValues(-30.0, 0),
            torque: 5.0
        });
        game.addBody(body1);

        // Add a circular body.
        let body2 : Body = new CircularBody(<CircularBodyDefinition>{
            position: vec2.fromValues(-50,60),
            radius: 10,
            mass: 1.0,
            velocity: vec2.fromValues(30.0, 0.0)
        });
        game.addBody(body2);  

        // PAIR 2
        // Add a rectangular body.
        let body3 : Body = new RectangularBody(<RectangularBodyDefinition>{
            position: vec2.fromValues(0,-60),
            width: 20,
            height: 20,
            mass: 1.0,
            velocity: vec2.fromValues(-30.0, 0),
            torque: 5.0,
            collisionCallback: checkCollisionCallback
        });
        game.addBody(body3);

      // Add a rectangular body.
        let body4 : Body = new RectangularBody(<RectangularBodyDefinition>{
            position: vec2.fromValues(-60,-60),
            width: 20,
            height: 20,
            mass: 1.0,
            velocity: vec2.fromValues(30.0, 0.0),
            collisionCallback: checkCollisionCallback
        });
        game.addBody(body4);  

        // PAIR 3
        // Add a rectangular body.
        let body5 : Body = new CircularBody(<CircularBodyDefinition>{
            position: vec2.fromValues(0,-90),
            radius: 10,
            mass: 1.0,
            velocity: vec2.fromValues(-30.0, 0)
        });
        game.addBody(body5);

      // Add a rectangular body.
        let body6 : Body = new RectangularBody(<RectangularBodyDefinition>{
            position: vec2.fromValues(-45,-90),
            width: 20,
            height: 20,
            mass: 1.0,
            velocity: vec2.fromValues(30.0, 0.0),
            torque: 5.0
        });
        game.addBody(body6);


        // Add ground.
        let ground : Body = new RectangularBody(<RectangularBodyDefinition>{
            position: vec2.fromValues(0,-150),
            width: 2000,
            height: 20,
            mass: 100000.0,
            collisionCallback: checkCollisionCallback
        });
        game.addBody(ground);

        // Add falling balls.
        let ball1 : Body = new CircularBody(<CircularBodyDefinition>{
            position: vec2.fromValues(-190,90),
            radius: 10,
            mass: 1.0,
            force: vec2.fromValues(0.0, -10.0),
            collisionCallback: checkCollisionCallback
        });
        game.addBody(ball1);
        let ball2 : Body = new CircularBody(<CircularBodyDefinition>{
            position: vec2.fromValues(190,90),
            radius: 10,
            mass: 1.0,
            force: vec2.fromValues(0.0, -10.0),
            collisionCallback: checkCollisionCallback
        });
        game.addBody(ball2);

        body1.onUpdate(backAndForthUpdateCallback(200, body2));
        body2.onUpdate(backAndForthUpdateCallback(400, body1));
        body3.onUpdate(backAndForthUpdateCallback(400, body4));
        body4.onUpdate(backAndForthUpdateCallback(400, body3));
        body5.onUpdate(backAndForthUpdateCallback(400, body6));
        body6.onUpdate(backAndForthUpdateCallback(400, body5));
    }
}