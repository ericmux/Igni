require("../dist/index.html");
import {WGLRenderer} from "./rendering/renderers/WGLRenderer";
import IgniEngine from "./engine/IgniEngine";
import Square from "./rendering/shapes/Square";
import Circle from "./rendering/shapes/Circle";
import Shape from "./rendering/shapes/Shape";
import Camera from "./rendering/camera/Camera";
import {vec2, vec3} from "gl-matrix";

let canvas : HTMLCanvasElement;
let game : IgniEngine;

let yAxis : Square = new Square(vec3.fromValues(0,0,0.0), 1, 773);
let xAxis : Square = new Square(vec3.fromValues(0,0,0.0), 773, 1);

window.onload = () => {
    canvas = <HTMLCanvasElement> document.getElementById("gl-canvas"); 
    let camera : Camera = new Camera(vec3.fromValues(0,0,0), 1, 1);
    let t = 0;
    camera.onUpdate((camera : Camera, deltaTime : number) => {
        camera.zoomX = 3 + 2*Math.sin((180/Math.PI)*t/2000);
        camera.zoomY = 3 + 2*Math.sin((180/Math.PI)*t/2000);
        t++;
    });

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

    game.add(sq1); game.add(sq2); game.add(sq3); game.add(sq4);
    game.add(cr1);
    game.add(xAxis); game.add(yAxis);
    game.start();

    

    setTimeout(() => {
        game.setCamera(sq4);
    }, 5000);
}

window.onresize = () => {
    game.resizeToCanvas();
    xAxis.width = canvas.width;
    yAxis.height = canvas.height;
}

