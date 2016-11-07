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

import {TextureManager, WGLTexture} from "./loader/TextureManager";
import {Loader} from "./loader/Loader";
import {Dictionary} from "./utils/Dictionary";
import Sprite from "./rendering/shapes/Sprite";

//  Engine mandatory
let canvas : HTMLCanvasElement;
let IGNI : IgniEngine;

//  Resource Management
let textureManager : TextureManager;

//  Global helping gizmos
let yAxis : RectangleShape = new RectangleShape(vec3.fromValues(0,0,0.0), 1, 773);
let xAxis : RectangleShape = new RectangleShape(vec3.fromValues(0,0,0.0), 773, 1);
xAxis.onUpdate((shape: Shape) => {});
yAxis.onUpdate((shape: Shape) => {});



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

    let circle = new CircleShape (vec3.fromValues (0,100,0), 10);
    circle.onUpdate ((shape : Shape, deltaTime : number) => {});
    IGNI.addShape (circle);

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

    let checkContainmentFunction = (point :vec2) => {
        return (body: Body, deltaTime: number) => {
            let shape :RectangleShape = <RectangleShape> body.shape;
            if (body.contains(point)) {
                shape.color = vec4.fromValues(Math.random(), Math.random(), Math.random(), 1.0)
            } 
            else {
                shape.color = vec4.fromValues(1.0,0.0,0.0,1.0);
            } 
        };
    };

    // // Add a rectangular body.
    // let body1 : Body = new RectangularBody(<RectangularBodyDefinition>{
    //     position: vec2.fromValues(60,60),
    //     width: 10,
    //     height: 10,
    //     mass: 1.0,
    //     force: vec2.fromValues(0.0,-5.0),
    //     velocity: vec2.fromValues(0.0, 50.0),
    //     torque: 5.0
    // });
    // body1.onUpdate(checkContainmentFunction(vec2.fromValues(60,0)));
    // game.addBody(body1);

    // // Add a circular body.
    // let body2 : Body = new CircularBody(<CircularBodyDefinition>{
    //     position: vec2.fromValues(40,60),
    //     radius: 10,
    //     mass: 1.0,
    //     force: vec2.fromValues(0.0,-10.0),
    //     velocity: vec2.fromValues(0.0, 50.0)
    // });
    // game.addBody(body2); 

    // // Add a circular body.
    // let body3 : Body = new CircularBody(<CircularBodyDefinition>{
    //     position: vec2.fromValues(30,60),
    //     radius: 10,
    //     mass: 0.5,
    //     force: vec2.fromValues(0.0,-10.0),
    //     velocity: vec2.fromValues(0.0, 50.0)
    // });
    // game.addBody(body3); 

    // Add a YUGE rectangular body.
    let body4 : Body = new RectangularBody(<RectangularBodyDefinition>{
        position: vec2.fromValues(0,0),
        width: 50,
        height: 50,
        mass: 1.0,
        force: vec2.fromValues(0.0,-8.0),
        velocity: vec2.fromValues(0.0, 30.0),
        torque: 5.0
    });
    body4.onUpdate(checkContainmentFunction(vec2.fromValues(0,0)));
    IGNI.addBody(body4);
    IGNI.start ();
};

let onWindowLoad = function () {
    canvas = <HTMLCanvasElement> document.getElementById("gl-canvas"); 
    let camera : Camera = new Camera(vec3.fromValues(0,0,0), 1, 1);
    camera.onUpdate((camera : Camera, deltaTime : number) => {});

    IGNI = new IgniEngine(canvas, camera);
    IGNI.addShape(xAxis);
    IGNI.addShape(yAxis);
    
    textureManager = new TextureManager (new Dictionary<string, WGLTexture> ());

    loadAssets ();
};

let onWindowResize = function () {
    IGNI.resizeToCanvas();
    xAxis.width = canvas.width;
    yAxis.height = canvas.height;
};

window.addEventListener("load", onWindowLoad, false);
window.addEventListener ("resize", onWindowResize, false);
