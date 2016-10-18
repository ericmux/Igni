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
    let sq5 : Square = new Square(vec3.fromValues(0.0,0.0,0.0), 2, 2);
    let cr1 : Circle = new Circle(vec3.fromValues(0,0,0), 1);

    let inc : number = 0.095;

    let t1 : number = 0.0, t2 : number = 0.0, t3 : number = 0.0;

    let horizontal_callback : (square :Square) => void = (square :Square) => {
        square.translate(vec2.fromValues(0.0,inc));
        square.rotate (inc);
        t1 += inc;
        if (t1 > 8.0 || t1 < -8.0) inc = -inc;
    } 
    let vertical_callback : (square :Square) => void = (square :Square) => {
        square.translate(vec2.fromValues(inc,0.0));
        t2 += inc;
        if (t2 > 5.0 || t3 < -5.0) inc = -inc;
    } 
    let diagonal_callback : (square :Square) => void = (square :Square) => {
        square.translate(vec2.fromValues(inc,inc));
        t3 += inc;
        if (t3 > 5.0 || t3 < -5.0) inc = -inc;
    } 

    sq1.onUpdate(horizontal_callback);
    sq2.onUpdate(horizontal_callback);
    sq3.onUpdate(vertical_callback);
    sq4.onUpdate(diagonal_callback);
    sq5.onUpdate(horizontal_callback);
    cr1.onUpdate ((shape : Shape) => {});

    game.add(sq1); game.add(sq2); game.add(sq3); game.add(sq4); game.add(sq5);
    game.add(cr1);
    game.start();

    setTimeout(() => {
        game.stop();
    }, 20000);
}

window.onresize = () => {
    game.resizeToCanvas();
}

