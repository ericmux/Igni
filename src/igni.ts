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

let canvas : HTMLCanvasElement;
let game : IgniEngine;
let axes :[RectangleShape, RectangleShape];

window.onload = () => {
    canvas = <HTMLCanvasElement> document.getElementById("gl-canvas"); 
    let camera : Camera = new Camera(vec3.fromValues(0,0,0), 1, 1);
    camera.onUpdate((camera : Camera, deltaTime : number) => {});

    game = new IgniEngine(canvas, camera);

    // Add axes for easy visualization.
    axes = CollisiontestScene.addAxes(game);

    // Containment test scene.
    CollisiontestScene.build(game);

    game.start();
}

window.onresize = () => {
    game.resizeToCanvas();
    axes[0].width = canvas.width;
    axes[1].height = canvas.height;
}

