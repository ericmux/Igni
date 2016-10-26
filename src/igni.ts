require("../dist/index.html");
import {WGLRenderer} from "./rendering/renderers/WGLRenderer";
import IgniEngine from "./engine/IgniEngine";
import Square from "./rendering/shapes/Square";
import Circle from "./rendering/shapes/Circle";
import Shape from "./rendering/shapes/Shape";
import Camera from "./rendering/camera/Camera";
import Body from "./physics/bodies/Body";
import {vec2, vec3} from "gl-matrix";

let canvas : HTMLCanvasElement;
let game : IgniEngine;

let yAxis : Square = new Square(vec3.fromValues(0,0,0.0), 1, 773);
let xAxis : Square = new Square(vec3.fromValues(0,0,0.0), 773, 1);

window.onload = () => {
    canvas = <HTMLCanvasElement> document.getElementById("gl-canvas"); 
    let camera : Camera = new Camera(vec3.fromValues(0,0,0), 1, 1);
    camera.onUpdate((camera : Camera, deltaTime : number) => {});

    game = new IgniEngine(canvas, camera);

    let sq1 : Square = new Square(vec3.fromValues(-5,-5,0.0), 5, 5);
    let sq2 : Square = new Square(vec3.fromValues(5,8,0.0), 10, 10);
    let sq3 : Square = new Square(vec3.fromValues(0,0,0.0), 10, 10);
    let sq4 : Square = new Square(vec3.fromValues(5,-5,0.0), 5, 5);
    let cr1 : Circle = new Circle(vec3.fromValues(0,80,0), 5);

    let speed : number = 10; //  Units per second

    let t1 : number = 0.0, t2 : number = 0.0, t3 : number = 0.0;

    let horizontal_callback : (square :Square, deltaTime : number) => void = (square :Square, deltaTime : number) => {
        square.translate(vec2.fromValues(speed*deltaTime,0.0));
        square.rotate (speed/100);
        t1 += deltaTime;
        if (t1 > 3.0) { 
            speed = -speed;
            t1 = 0;
        }
    } 
    let vertical_callback : (square :Square, deltaTime : number) => void = (square :Square, deltaTime : number) => {
        square.translate(vec2.fromValues(0.0, speed*deltaTime));
        t2 += deltaTime;
        if (t2 > 3.0) {
            speed = -speed;
            t2 = 0;
        }
    } 
    let diagonal_callback : (square :Square, deltaTime : number) => void = (square :Square, deltaTime : number) => {
        square.translate(vec2.fromValues(speed*deltaTime,speed*deltaTime));
        t3 += deltaTime;
        if (t3 > 3.0) {
            speed = -speed;
            t3 = 0;
        }
    } 

    sq1.onUpdate(horizontal_callback);
    sq2.onUpdate(horizontal_callback);
    sq3.onUpdate(vertical_callback);
    sq4.onUpdate(diagonal_callback);
    xAxis.onUpdate((shape: Shape) => {});
    yAxis.onUpdate((shape: Shape) => {});
    cr1.onUpdate ((shape : Shape) => {});

    game.addShape(sq1); game.addShape(sq3); game.addShape(sq4);
    game.addShape(cr1);
    game.addShape(xAxis); game.addShape(yAxis);

    // Add a body.
    let body1 : Body = new Body(vec2.fromValues(60,60), 10, 10);
    body1.force = vec2.fromValues(0.0,-5.0);
    body1.velocity = vec2.fromValues(0.0, 50.0);
    body1.torque = 0.01;
    
    game.addBody(body1);

    game.start();
}

window.onresize = () => {
    game.resizeToCanvas();
    xAxis.width = canvas.width;
    yAxis.height = canvas.height;
}

