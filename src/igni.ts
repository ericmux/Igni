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

//  Global helping gizmos
let yAxis : RectangleShape = new RectangleShape(vec3.fromValues(0,0,0.0), 1, 773);
let xAxis : RectangleShape = new RectangleShape(vec3.fromValues(0,0,0.0), 773, 1);
xAxis.onUpdate((shape: Shape) => {});
yAxis.onUpdate((shape: Shape) => {});

let leftBorder = -100;
let rightBorder = 100;
let topBorder = 100;
let bottomBorder = -100;

let reflectOnWalls = function (body : CircularBody, deltaTime : number) {
    if (body.position[0] - body.radius < leftBorder) {
        body.position[0] -= body.position[0] - body.radius - leftBorder;
        body.velocity[0] *= -1;
    }
    if (body.position[0] + body.radius > rightBorder) {
        body.position[0] -= body.position[0] + body.radius - rightBorder;
        body.velocity[0] *= -1;
    }
    if (body.position[1] - body.radius < bottomBorder ) {
        body.position[1] -= body.position[1] - body.radius - bottomBorder;
        body.velocity[1] *= -1;
    }
    if (body.position[1] + body.radius > topBorder) {
        body.position[1] -= body.position[1] + body.radius - topBorder;
        body.velocity[1] *= -1;
    }
};

let reflectOnWallsRect = function (body : RectangularBody, deltaTime : number) {
    if (body.position[0] - 10 < leftBorder) {
        body.position[0] -= body.position[0] - 10 - leftBorder;
        body.velocity[0] *= -1;
    }
    if (body.position[0] + 10 > rightBorder) {
        body.position[0] -= body.position[0] + 10 - rightBorder;
        body.velocity[0] *= -1;
    }
    if (body.position[1] - 10 < bottomBorder ) {
        body.position[1] -= body.position[1] - 10 - bottomBorder;
        body.velocity[1] *= -1;
    }
    if (body.position[1] + 10 > topBorder) {
        body.position[1] -= body.position[1] + 10 - topBorder;
        body.velocity[1] *= -1;
    }
};

let time = 0;
let sinScale = function (body : Body, deltaTime : number) {
    time += deltaTime;
    if (time < 10) {
    let aux = Math.sin (2 * Math.PI * 0.1* time);
    body.shape.setScale (vec2.fromValues(aux, aux));
    }
    else
    body.shape.setScale (vec2.fromValues (10,10));
};

let leftBorderShape : RectangleShape = new RectangleShape(vec3.fromValues(leftBorder,0,0.0), 1, topBorder-bottomBorder);
let rightBorderShape : RectangleShape = new RectangleShape(vec3.fromValues(rightBorder,0,0.0), 1,topBorder-bottomBorder);
let bottomBorderShape : RectangleShape = new RectangleShape (vec3.fromValues (0, bottomBorder,0), rightBorder-leftBorder, 1);
let topBorderShape : RectangleShape = new RectangleShape (vec3.fromValues (0,topBorder,0), rightBorder-leftBorder, 1);

leftBorderShape.onUpdate((shape: Shape) => {});
rightBorderShape.onUpdate((shape: Shape) => {});
bottomBorderShape.onUpdate((shape: Shape) => {});
topBorderShape.onUpdate((shape: Shape) => {});


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

    //  Add some sprites
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

    let cbodydefs = [
        <CircularBodyDefinition>{
        position: vec2.fromValues(10,60),
        radius: 10,
        mass: 1.0,
        force: vec2.fromValues(0.0,0.0),
        velocity: vec2.fromValues(70.0, 20.0)
        }, 
        <CircularBodyDefinition>{
        position: vec2.fromValues(40,60),
        radius: 10,
        mass: 1.0,
        force: vec2.fromValues(0.0,0.0),
        velocity: vec2.fromValues(60.0, 60.0)
    }
    ];

    // Add a circular body.
    for (let i = 0; i < 2; ++i) {
        let body : Body = new CircularBody(cbodydefs[i%2]);
        body.velocity = vec2.scale (body.velocity, body.velocity, Math.random());
        body.onUpdate (sinScale);
        IGNI.addBody(body); 
    }

    


let cbodydefs2 = [
        <RectangularBodyDefinition>{
        position: vec2.fromValues(0,0),
        width: 20,
        height: 20,
        mass: 1.0,
        force: vec2.fromValues(0.0,0.0),
        velocity: vec2.fromValues(20.0, 30.0)
        },
        <RectangularBodyDefinition>{
        position: vec2.fromValues(-70,35),
        width: 20,
        height: 20,
        mass: 1.0,
        velocity: vec2.fromValues(-40.0, -20.0)
        }
    ];

    // Add a circular body.
    for (let i = 0; i < 2; ++i) {
        let body : Body = new RectangularBody(cbodydefs2[i%2]);
        body.velocity = vec2.scale (body.velocity, body.velocity, Math.random());
        body.onUpdate (reflectOnWallsRect);
        IGNI.addBody(body);
    }


    // Add a YUGE rectangular body.
    // let body4 : Body = new RectangularBody(<RectangularBodyDefinition>{
    //     position: vec2.fromValues(0,0),
    //     width: 50,
    //     height: 50,
    //     mass: 1.0,
    //     force: vec2.fromValues(0.0,-8.0),
    //     velocity: vec2.fromValues(0.0, 30.0),
    //     torque: 5.0
    // });
    // body4.onUpdate(checkContainmentFunction(vec2.fromValues(0,0)));
    // IGNI.addBody(body4);
    IGNI.start ();
};

let onWindowLoad = function () {
    canvas = <HTMLCanvasElement> document.getElementById("gl-canvas");

    let camera : Camera = new Camera(vec3.fromValues(0,0,0), 1, 1);
    camera.onUpdate((camera : Camera, deltaTime : number) => {});

    IGNI = new IgniEngine(canvas, camera, <EngineOptions> {
        frameControl : true,
        stopKeyBinding : 49,
        resumeKeyBinding : 50,
        resumeFrameKeyBinding : 51
    });

    // Add axes for easy visualization.
    // axes = CollisiontestScene.addAxes(IGNI);
    
    IGNI.addShape(xAxis);
    IGNI.addShape(yAxis);
    IGNI.addShape (leftBorderShape);
    IGNI.addShape (rightBorderShape);
    IGNI.addShape (bottomBorderShape);
    IGNI.addShape (topBorderShape);

    textureManager = new TextureManager (new Dictionary<string, WGLTexture> ());

    loadAssets ();
};

let onWindowResize = function () {
    IGNI.resizeToCanvas();
    // axes[0].width = canvas.width;
    // axes[1].height = canvas.height;
};

window.addEventListener("load", onWindowLoad, false);
window.addEventListener ("resize", onWindowResize, false);
