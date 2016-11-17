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
import IgniEngine from "../engine/IgniEngine";
import Sprite from "../rendering/shapes/Sprite";

export default class BasketballsTestScene extends TestScene {
    public static build(game :Engine) :void {

        let onAssetsLoaded =  () => {

            // Add ground.
            let ground : Body = new RectangularBody(<RectangularBodyDefinition>{
                position: vec2.fromValues(0,-15),
                width: 100,
                height: 20,
                mass: 100000.0,
                isStaticBody : true
            });
            game.addBody(ground);

            // Add walls.
            let left_wall : Body = new RectangularBody(<RectangularBodyDefinition>{
                position: vec2.fromValues(-5,0),
                width: 5,
                height: 50,
                mass: 1000000000000.0,
                isStaticBody : true
            });
            game.addBody(left_wall);
            let right_wall : Body = new RectangularBody(<RectangularBodyDefinition>{
                position: vec2.fromValues(5,0),
                width: 5,
                height: 50,
                mass: 1000000000000.0,
                isStaticBody : true
            });
            game.addBody(right_wall);

            setTimeout(function() {
                setLevel ();
                
            }, 3000);
        };

        let setLevel = () => {
            // Add matrix of squares.
            let radius = 0.5;
            let start_pos :vec2 = vec2.fromValues(0,2);
            let pos :vec2 = vec2.create();
            let sprite = new Sprite (vec2.fromValues (0, 0), "./basketball.png", 2*radius, 2*radius, vec4.fromValues(1,1,1,1), false);
            for(let i = 0; i < 1; i++){
                for(let j = 0; j < 10; j++) {
                    
        

                    vec2.add(pos, start_pos, vec2.fromValues(1*i, 1.5*j));

                    let sprite = new Sprite (vec2.fromValues (pos[0], pos[1]), "./basketball.png", 2*radius, 2*radius, vec4.fromValues(1,1,1,1), false);
                    let body : Body = new CircularBody(<CircularBodyDefinition>{
                        position: pos,
                        radius: radius,
                        mass: 2.30,
                        force: vec2.fromValues(0, -23.0),
                        // velocity: vec2.fromValues(((i+j)%3-1) * 10, 0),
                        visualShape : sprite
                    });
                    game.addBody(body);
                }
            }

            // Add ground.
            let square : Body = new RectangularBody(<RectangularBodyDefinition>{
                position: vec2.fromValues(0,-129),
                force: vec2.fromValues(0, -45.0),
                width: 20,
                height: 20,
                mass: 1.0
            });
            // game.addBody(square);

            // ADD SINGLE CIRCLE
            let body : Body = new CircularBody(<CircularBodyDefinition>{
                position: vec2.fromValues (0,2),
                radius: radius,
                mass: 2.30,
                force: vec2.fromValues(0, -23.0),
                // velocity: vec2.fromValues(-200, 0),
                // torque: -5.0,
                visualShape : sprite
            });
            // game.addBody(body);

            let body2 : Body = new CircularBody(<CircularBodyDefinition>{
                position: vec2.fromValues (0,-100),
                radius: radius,
                mass: 1.0,
                force: vec2.fromValues(0, -30.0),
                velocity: vec2.fromValues(70.0, 0),
                angularVelocity : 0,
                // torque: 0.5,
                visualShape : sprite
            });
            // game.addBody(body2);

        };



        game.loader.onLoadResource.add (game.textureManager.onLoadResource.bind (game.textureManager));
        game.loader.onCompleteSignal.once (onAssetsLoaded);

        //  These images are 64x64 px
        game.loader.enqueue ("./basketball.png");

        game.loader.load ();

    }
}