require("../dist/index.html");
import {WGLRenderer} from "./rendering/renderers/WGLRenderer.ts";
import IgniEngine from "./engine/IgniEngine";
import Square from "./rendering/shapes/Square";
import {vec2} from "gl-matrix";

let canvas : HTMLCanvasElement;
let game : IgniEngine;

window.onload = () => {
    canvas = <HTMLCanvasElement> document.getElementById("gl-canvas"); 
    game = new IgniEngine(canvas);

    let sq1 : Square = new Square(vec2.fromValues(-50,-50));
    let sq2 : Square = new Square(vec2.fromValues(50,50));

    game.add(sq1); game.add(sq2);
    game.start();
}

window.onresize = () => {
    game.resizeToCanvas();
}

