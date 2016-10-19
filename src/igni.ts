require("../dist/index.html");
import {WGLRenderer} from "./rendering/renderers/WGLRenderer";
import IgniEngine from "./engine/IgniEngine";
import Square from "./rendering/shapes/Square";
import Circle from "./rendering/shapes/Circle";
import Shape from "./rendering/shapes/Shape";
import {vec2, vec3} from "gl-matrix";

let canvas : HTMLCanvasElement;
let game : IgniEngine;

window.onload = () => {
    canvas = <HTMLCanvasElement> document.getElementById("gl-canvas"); 
    game = new IgniEngine(canvas);

    let sq1 : Square = new Square(vec3.fromValues(-5,-5,0.0), 0.5, 0.5);
    let sq2 : Square = new Square(vec3.fromValues(5,8,0.0), 1, 1);
    let sq3 : Square = new Square(vec3.fromValues(-8*1.174,5,0.0), 1, 1);
    let sq4 : Square = new Square(vec3.fromValues(5,-5,0.0), 0.5, 0.5);
    let sq5 : Square = new Square(vec3.fromValues(0.0,0.0,0.0), 1, 1);
    let cr1 : Circle = new Circle(vec3.fromValues(0,8,0), 0.5);

    let speed : number = 1; //  Units per second

    let t1 : number = 0.0, t2 : number = 0.0, t3 : number = 0.0;

    let horizontal_callback : (square :Square, deltaTime : number) => void = (square :Square, deltaTime : number) => {
        square.translate(vec2.fromValues(speed*deltaTime,0.0));
        square.rotate (speed/10);
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
    sq5.onUpdate(vertical_callback);
    cr1.onUpdate ((shape : Shape) => {});

    // game.add(sq1); // repeating a callback will mess with time count.
                      //  lazy to fix now
    game.add(sq2); game.add(sq3); game.add(sq4); 
    // game.add(sq5);
    game.add(cr1);
    game.start();

    setTimeout(() => {
        game.stop();
    }, 20000);
}

window.onresize = () => {
    game.resizeToCanvas();
}

