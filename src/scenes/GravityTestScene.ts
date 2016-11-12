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

export default class GravityTestScene extends TestScene {
    public static build(game :Engine) :void {

        let checkCollisionCallback = (collisionManifold :CollisionManifold) => {
            let color :vec4 = vec4.fromValues(Math.random(), Math.random(), Math.random(), 1.0);
            (<RectangleShape>collisionManifold.bodyA.shape).color = color;
            (<RectangleShape>collisionManifold.bodyB.shape).color = color;
        };

        // Add matrix of squares.
        let start_pos :vec2 = vec2.fromValues(-200, 200);
        let pos :vec2 = vec2.create();
        for(let i = 0; i < 5; i++){
            for(let j = 0; j < 5; j++) {
                vec2.add(pos, start_pos, vec2.fromValues(80*i, -80*j));
                let body : Body = new RectangularBody(<RectangularBodyDefinition>{
                    position: pos,
                    width: 20,
                    height: 20,
                    mass: 1.0,
                    force: vec2.fromValues(0, -30.0),
                    velocity: vec2.fromValues(0, 0),
                    torque: 5.0,
                    collisionCallback: checkCollisionCallback
                });
                game.addBody(body);
            }
        }

        // Add ground.
        let ground : Body = new RectangularBody(<RectangularBodyDefinition>{
            position: vec2.fromValues(0,-150),
            width: 2000,
            height: 20,
            mass: 100000.0,
            collisionCallback: checkCollisionCallback
        });
        game.addBody(ground);

        // Add walls.
        let left_wall : Body = new RectangularBody(<RectangularBodyDefinition>{
            position: vec2.fromValues(-400,0),
            width: 20,
            height: 279.9,
            mass: 100000.0,
            collisionCallback: checkCollisionCallback
        });
        game.addBody(left_wall);
        let right_wall : Body = new RectangularBody(<RectangularBodyDefinition>{
            position: vec2.fromValues(400,0),
            width: 20,
            height: 279.9,
            mass: 100000.0,
            collisionCallback: checkCollisionCallback
        });
        game.addBody(right_wall);


    }
}