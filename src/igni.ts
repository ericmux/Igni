require("../dist/index.html");
import {WGLRenderer} from "./rendering/renderers/WGLRenderer";
import IgniEngine from "./engine/IgniEngine";
import RectangleShape from "./rendering/shapes/RectangleShape";
import CircleShape from "./rendering/shapes/CircleShape";
import Shape from "./rendering/shapes/Shape";
import Camera from "./rendering/camera/Camera";
import Body from "./physics/bodies/Body";
import RectangularBody from "./physics/bodies/RectangularBody";
import CircularBody from "./physics/bodies/CircularBody";
import BodyDefinition from "./physics/bodies/BodyDefinition";
import RectangularBodyDefinition from "./physics/bodies/RectangularBodyDefinition";
import CircularBodyDefinition from "./physics/bodies/CircularBodyDefinition";
import {vec2, vec3, vec4} from "gl-matrix";
import VelocityVerletIntegrator from "./physics/integration/VelocityVerletIntegrator";
import SemiImplicitEulerIntegrator from "./physics/integration/SemiImplicitEulerIntegrator";
import ForwardEulerIntegrator from "./physics/integration/ForwardEulerIntegrator";
import ContainmentTestScene from "./scenes/ContainmentTestScene";
import CollisiontestScene from "./scenes/CollisiontestScene";

import {TextureManager, WGLTexture} from "./loader/TextureManager";
import {Loader} from "./loader/Loader";
import {Dictionary} from "./utils/Dictionary";
import Sprite from "./rendering/shapes/Sprite";

//  Engine mandatory
let canvas : HTMLCanvasElement;
let IGNI : IgniEngine;
let axes :[RectangleShape, RectangleShape];

//  Resource Management
let textureManager : TextureManager;

let loadAssets = function () {
    
    IGNI.loader.onLoadResource.add (textureManager.onLoadResource.bind (textureManager));
    IGNI.loader.onCompleteSignal.once (onAssetsLoaded);

    //  These images are 64x64 px
    IGNI.loader.enqueue ("./1.png", {pixelsPerUnit : 6.4});
    IGNI.loader.enqueue ("./2.png", {pixelsPerUnit : 3.2});
    IGNI.loader.enqueue ("./3.png", {pixelsPerUnit : 1});

    IGNI.loader.load ();
};

let onAssetsLoaded = function () {
    //  Maybe do some level prepocessing ...

    //  then,
    setLevel ();
};

let setLevel = function () {
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
        IGNI.addShape (sprites[ii]);
    }

    // Collision test scene.
    CollisiontestScene.build(IGNI);

    IGNI.start ();
};

let onWindowLoad = function () {
    canvas = <HTMLCanvasElement> document.getElementById("gl-canvas"); 
    let camera : Camera = new Camera(vec3.fromValues(0,0,0), 1, 1);
    camera.onUpdate((camera : Camera, deltaTime : number) => {});

    IGNI = new IgniEngine(canvas, camera);

    // Add axes for easy visualization.
    axes = CollisiontestScene.addAxes(IGNI);
    
    textureManager = new TextureManager (new Dictionary<string, WGLTexture> ());

    loadAssets ();
};

let onWindowResize = function () {
    IGNI.resizeToCanvas();
    axes[0].width = canvas.width;
    axes[1].height = canvas.height;
};
window.addEventListener("load", onWindowLoad, false);
window.addEventListener ("resize", onWindowResize, false);
