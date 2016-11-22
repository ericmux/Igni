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

// Events
import {KeyboardEventInfo} from "../input/EventInfo";
import Keys from "../input/Keys";

export default class ThrowingTestScene extends TestScene {
    public static build(game :IgniEngine) :void {

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

            // Add celing.
            let ceilling : Body = new RectangularBody(<RectangularBodyDefinition>{
                position: vec2.fromValues(0,16),
                width: 100,
                height: 20,
                mass: 100000.0,
                isStaticBody : true
            });
            game.addBody(ceilling);

            // Add walls.
            let left_wall : Body = new RectangularBody(<RectangularBodyDefinition>{
                position: vec2.fromValues(-15,0),
                width: 5,
                height: 50,
                mass: 1000000000000.0,
                isStaticBody : true
            });
            game.addBody(left_wall);
            let right_wall : Body = new RectangularBody(<RectangularBodyDefinition>{
                position: vec2.fromValues(15,0),
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
                        
            let dt = 0;
            let angularVelocity = 5;
            let arrowPos = vec2.fromValues (0,0);
            let arrow : Sprite = new Sprite (vec2.fromValues (arrowPos[0], arrowPos[1]), "./arrow.png", 2, 1, vec4.fromValues(1,1,1,1), false); 
            arrow.engine = game;
            arrow.onUpdate ((shape: RectangleShape, deltaTime : number) => {
                dt = deltaTime;
            });
            arrow.onKeyPressed((target :Sprite, event_info :KeyboardEventInfo) => {
                 let pos :vec2 = target.getPosition();

                switch(event_info.key) {
                    case Keys.UP: target.rotate (angularVelocity * dt); break;
                    case Keys.DOWN: target.rotate (-angularVelocity * dt); break;
                    case Keys.SPACEBAR: {

                        let rotation = target.getRotation ();
                        
                        let xSpeed = Math.cos (rotation) * (Math.random () + 3) * 5;
                        let ySpeed = Math.sin (rotation) * (Math.random () + 5) * 5;

                        let radius = 0.5;

                        let sprite = new Sprite (vec2.fromValues (pos[0], pos[1]), "./basketball.png", 2*radius, 2*radius, vec4.fromValues(1,1,1,1), false);
                        let body : Body = new CircularBody(<CircularBodyDefinition>{
                        position: pos,
                        radius: radius,
                        mass: 2.30,
                        restitutionCoefficient : 0.7,
                        force: vec2.fromValues(0, -23.0),
                        velocity: vec2.fromValues(xSpeed, ySpeed),
                        visualShape : sprite
                    });
                    game.addBody(body);
                    } break;
                    case Keys.SHIFT: {

                        let rotation = target.getRotation ();
                        
                        let xSpeed = Math.cos (rotation) * (Math.random () + 3) * 5;
                        let ySpeed = Math.sin (rotation) * (Math.random () + 5) * 5;

                        let radius = 0.5;

                        let sprite = new Sprite (vec2.fromValues (pos[0], pos[1]), "./question_brick.jpg", 2*radius, 2*radius, vec4.fromValues(1,1,1,1), false);
                        let body : Body = new RectangularBody(<RectangularBodyDefinition>{
                        position: pos,
                        width: 2*radius,
                        height: 2*radius,
                        mass: 8.0,
                        restitutionCoefficient : 0.3,
                        force: vec2.fromValues(0, -80.0),
                        velocity: vec2.fromValues(xSpeed, ySpeed),
                        visualShape : sprite
                    });
                    game.addBody(body);
                    } break;
                }
            });
            game.addShape (arrow);
        };


        game.loader.onLoadResource.add (game.textureManager.onLoadResource.bind (game.textureManager));
        game.loader.onCompleteSignal.once (onAssetsLoaded);

        //  These images are 64x64 px
        game.loader.enqueue ("./basketball.png");
        game.loader.enqueue ("./question_brick.jpg");
        game.loader.enqueue ("./arrow.png");

        game.loader.load ();

    }
}