require("../dist/index.html");
import {WGLRenderer} from "./rendering/renderers/WGLRenderer";
import IgniEngine from "./engine/IgniEngine";
import {EngineOptions} from "./engine/Engine";
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
import TestScene from "./scenes/TestScene";
import {TextureManager, WGLTexture} from "./loader/TextureManager";
import {Loader} from "./loader/Loader";
import {Dictionary} from "./utils/Dictionary";
import Sprite from "./rendering/shapes/Sprite";

// Test Scenes.
import ContainmentTestScene from "./scenes/ContainmentTestScene";
import CollisiontestScene from "./scenes/CollisiontestScene";
import TextureLoadingTestScene from "./scenes/TextureLoadingTestScene";

//  Game, canvas and a reference to the axis shapes.
let canvas : HTMLCanvasElement;
let game : IgniEngine;
let axes :[RectangleShape, RectangleShape];

let onWindowLoad = function () {
    canvas = <HTMLCanvasElement> document.getElementById("gl-canvas");

    let camera : Camera = new Camera(vec3.fromValues(0,0,0), 1, 1);
    camera.onUpdate((camera : Camera, deltaTime : number) => {});


    game = new IgniEngine(canvas, camera);

    // Add axes for easy visualization.
    axes = TestScene.addAxes(game);

    //// Texture Loading test scene.
    //TextureLoadingTestScene.build(game);

    //// Containment test scene.
    //ContainmentTestScene.build(game);

    // Collision test scene.
    CollisiontestScene.build(game);

    game.start();
};

let onWindowResize = function () {
    game.resizeToCanvas();
    axes[0].width = canvas.width;
    axes[1].height = canvas.height;
};

window.addEventListener("load", onWindowLoad, false);
window.addEventListener ("resize", onWindowResize, false);
