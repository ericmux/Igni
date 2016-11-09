import {vec2, vec3, vec4} from "gl-matrix";
import TestScene from "./TestScene"
import RectangleShape from "../rendering/shapes/RectangleShape";
import Body from "../physics/bodies/Body";
import Sprite from "../rendering/shapes/Sprite";
import Shape from "../rendering/shapes/Shape";
import RectangularBody from "../physics/bodies/RectangularBody";
import CircularBody from "../physics/bodies/CircularBody";
import BodyDefinition from "../physics/bodies/BodyDefinition";
import RectangularBodyDefinition from "../physics/bodies/RectangularBodyDefinition";
import CircularBodyDefinition from "../physics/bodies/CircularBodyDefinition";
import Engine from "../engine/Engine";

export default class CollisionTestScene extends TestScene {
    public static build(game :Engine) :void {
        let onAssetsLoaded =  () => {
            //  Maybe do some level prepocessing ...

            //  then,
            setLevel ();
        };
        
        game.loader.onLoadResource.add (game.textureManager.onLoadResource.bind (game.textureManager));
        game.loader.onCompleteSignal.once (onAssetsLoaded);

        //  These images are 64x64 px
        game.loader.enqueue ("./1.png", {pixelsPerUnit : 6.4});
        game.loader.enqueue ("./2.png", {pixelsPerUnit : 3.2});
        game.loader.enqueue ("./3.png", {pixelsPerUnit : 1});

        game.loader.load ();

        let setLevel = () => {
            //  Add some sprites.
            let sprites : Sprite[] = [];
            let bottom = -300;
            let left = -300;
            let passo = 300;
            for (let i = 1; i <= 3; ++i) {
                let path = "./"+i+".png";
                let ii = i-1;
                sprites.push (new Sprite (vec3.fromValues(left + ii * passo, bottom + ii * passo,0), path));
                sprites[ii].onUpdate ((shape : Shape, deltaTime : number) => {});
                game.addShape (sprites[ii]);
            }
        };
    }
}