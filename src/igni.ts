require("../dist/index.html");
import {WGLRenderer} from "./rendering/renderers/WGLRenderer";
import IgniEngine from "./engine/IgniEngine";
import Square from "./rendering/shapes/Square";
import Circle from "./rendering/shapes/Circle";
import Shape from "./rendering/shapes/Shape";
import Camera from "./rendering/camera/Camera";
import Body from "./physics/bodies/Body";
import RectangularBody from "./physics/bodies/RectangularBody";
import CircularBody from "./physics/bodies/CircularBody";
import BodyDefinition from "./physics/bodies/BodyDefinition";
import RectangularBodyDefinition from "./physics/bodies/RectangularBodyDefinition";
import CircularBodyDefinition from "./physics/bodies/CircularBodyDefinition";
import {vec2, vec3} from "gl-matrix";
import VelocityVerletIntegrator from "./physics/integration/VelocityVerletIntegrator";
import SemiImplicitEulerIntegrator from "./physics/integration/SemiImplicitEulerIntegrator";
import ForwardEulerIntegrator from "./physics/integration/ForwardEulerIntegrator";

let canvas : HTMLCanvasElement;
let game : IgniEngine;

let yAxis : Square = new Square(vec3.fromValues(0,0,0.0), 1, 773);
let xAxis : Square = new Square(vec3.fromValues(0,0,0.0), 773, 1);
xAxis.onUpdate((shape: Shape) => {});
yAxis.onUpdate((shape: Shape) => {});

window.onload = () => {
    canvas = <HTMLCanvasElement> document.getElementById("gl-canvas"); 
    let camera : Camera = new Camera(vec3.fromValues(0,0,0), 1, 1);
    camera.onUpdate((camera : Camera, deltaTime : number) => {});

    game = new IgniEngine(canvas, camera);
    game.addShape(xAxis);
    game.addShape(yAxis);

    // Add a rectangular body.
    let body1 : Body = new RectangularBody(<RectangularBodyDefinition>{
        position: vec2.fromValues(60,60),
        width: 10,
        height: 10,
        mass: 1.0,
        force: vec2.fromValues(0.0,-5.0),
        velocity: vec2.fromValues(0.0, 50.0),
        torque: 5.0
    });
    game.addBody(body1);

    // Add a circular body.
    let body2 : Body = new CircularBody(<CircularBodyDefinition>{
        position: vec2.fromValues(40,60),
        radius: 10,
        mass: 1.0,
        force: vec2.fromValues(0.0,-10.0),
        velocity: vec2.fromValues(0.0, 50.0)
    });
    game.addBody(body2); 

    // Add a circular body.
    let body3 : Body = new CircularBody(<CircularBodyDefinition>{
        position: vec2.fromValues(30,60),
        radius: 10,
        mass: 0.5,
        force: vec2.fromValues(0.0,-10.0),
        velocity: vec2.fromValues(0.0, 50.0)
    });
    game.addBody(body3); 

    game.start();
}

window.onresize = () => {
    game.resizeToCanvas();
    xAxis.width = canvas.width;
    yAxis.height = canvas.height;
}

