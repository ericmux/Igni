import {vec2} from "gl-matrix"; 
import RectangleShape from "../rendering/shapes/RectangleShape";
import Engine from "../engine/Engine";
import Shape from "../rendering/shapes/Shape";

export default class TestScene {
    public static addAxes(game :Engine) :[RectangleShape, RectangleShape] {
        let yAxis : RectangleShape = new RectangleShape(vec2.fromValues(0,0), 0.1, 773);
        let xAxis : RectangleShape = new RectangleShape(vec2.fromValues(0,0), 773, 0.1);
        xAxis.onUpdate((shape: Shape) => {});
        yAxis.onUpdate((shape: Shape) => {});
        game.addShape(xAxis);
        game.addShape(yAxis);

        return [xAxis, yAxis];
    }
}