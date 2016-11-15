import {vec2, vec3, vec4} from "gl-matrix";
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

export default class InclinedPlaneTestScene extends TestScene {
    public static build(game :Engine) :void {

        let onAssetsLoaded =  () => {
            setLevel ();
        };

        let setLevel = () => {


            // ADD SINGLE CIRCLE

            let planeAngle = (Math.PI/180) * 75;

            let radius = 10;
            let sprite = new Sprite (vec3.fromValues (0, 0, 0), "./basketball.png", 2*radius, 2*radius, vec4.fromValues(1,1,1,1), false);


            let body : Body = new CircularBody(<CircularBodyDefinition>{
                position: vec2.fromValues (-50,-0),
                radius: radius,
                mass: 2.3,
                force: vec2.fromValues(0, -30.0 * 2.3),
                velocity: vec2.fromValues(0, -30),
                visualShape : sprite
            });
            game.addBody(body);

            let body1 : Body = new RectangularBody(<RectangularBodyDefinition>{
                position: vec2.fromValues(-70,-81),
                angle : planeAngle,
                width: 20,
                height: 20,
                mass: 12.0,
                restitutionCoefficient: 0.2,
                force: vec2.fromValues(0, -30.0*12),
                velocity: vec2.fromValues(0.0, 0.0)
            });
            game.addBody (body1);

            let body2 : Body = new RectangularBody(<RectangularBodyDefinition>{
                position: vec2.fromValues(-70,-40),
                angle : planeAngle,
                width: 20,
                height: 20,
                mass: 10.0,
                restitutionCoefficient: 0.2,
                force: vec2.fromValues(0, -30.0*10),
                velocity: vec2.fromValues(0.0, 0.0)
            });
            game.addBody (body2);

            let inclinedPlane : Body = new RectangularBody(<RectangularBodyDefinition>{
                position: vec2.fromValues(0,-100),
                angle : (Math.PI/180) * 75,
                width: 20,
                height: 200,
                mass: 1000000000000.0,
                isStaticBody : true
            });
            game.addBody (inclinedPlane);

            // Add ground.
            let ground : Body = new RectangularBody(<RectangularBodyDefinition>{
                position: vec2.fromValues(0,-150),
                width: 2000,
                height: 20,
                mass: 100000.0,
                isStaticBody : true
            });
            game.addBody(ground);

            // Add walls.
            let left_wall : Body = new RectangularBody(<RectangularBodyDefinition>{
                position: vec2.fromValues(-80,0),
                width: 20,
                height: 279.9,
                mass: 1000000000000.0,
                isStaticBody : true
            });
            game.addBody(left_wall);
            let right_wall : Body = new RectangularBody(<RectangularBodyDefinition>{
                position: vec2.fromValues(80,0),
                width: 20,
                height: 279.9,
                mass: 1000000000000.0,
                isStaticBody : true
            });
            game.addBody(right_wall);

        };
        
        game.loader.onLoadResource.add (game.textureManager.onLoadResource.bind (game.textureManager));
        game.loader.onCompleteSignal.once (onAssetsLoaded);

        //  These images are 64x64 px
        game.loader.enqueue ("./basketball.png");

        game.loader.load ();
    }
}